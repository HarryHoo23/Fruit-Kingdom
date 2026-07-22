import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { starterStories } from "../features/stories/storySeeds";
import type {
  RegionId,
  Story,
  StoryDraft,
  StoryLanguage,
  StoryTranslations,
} from "../types/domain";

const collectionName = "stories";

interface FirestoreStory {
  title: string;
  regionId: RegionId;
  summary: string;
  content: string;
  moralLesson: string;
  originalLanguage?: StoryLanguage;
  translations?: StoryTranslations;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const localKey = "fruit-kingdom-stories";

const readLocalStories = (): Story[] => {
  const raw = window.localStorage.getItem(localKey);
  if (!raw) return starterStories;

  try {
    const parsed = JSON.parse(raw) as Array<
      Omit<Story, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string }
    >;
    return parsed.map((story) => ({
      ...story,
      originalLanguage: story.originalLanguage,
      translations: story.translations,
      createdAt: new Date(story.createdAt),
      updatedAt: new Date(story.updatedAt),
    }));
  } catch {
    return starterStories;
  }
};

const readPersistedLocalStories = (): Story[] => {
  const raw = window.localStorage.getItem(localKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Array<
      Omit<Story, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string }
    >;
    return parsed.map((story) => ({
      ...story,
      originalLanguage: story.originalLanguage,
      translations: story.translations,
      createdAt: new Date(story.createdAt),
      updatedAt: new Date(story.updatedAt),
    }));
  } catch {
    return [];
  }
};

const writeLocalStories = (stories: Story[]) => {
  window.localStorage.setItem(localKey, JSON.stringify(stories));
};

const mapFirestoreStory = (id: string, data: FirestoreStory): Story => ({
  id,
  title: data.title,
  regionId: data.regionId,
  summary: data.summary,
  content: data.content,
  moralLesson: data.moralLesson,
  originalLanguage: data.originalLanguage,
  translations: data.translations,
  createdAt: data.createdAt?.toDate() ?? new Date(),
  updatedAt: data.updatedAt?.toDate() ?? new Date(),
});

const starterStoryToFirestoreStory = (story: Story) => ({
  title: story.title,
  regionId: story.regionId,
  summary: story.summary,
  content: story.content,
  moralLesson: story.moralLesson,
  originalLanguage: story.originalLanguage,
  translations: story.translations,
  createdAt: Timestamp.fromDate(story.createdAt),
  updatedAt: Timestamp.fromDate(story.updatedAt),
});

const withPrimaryTranslation = (story: Story): Story => {
  const originalLanguage = story.originalLanguage ?? "en";
  return {
    ...story,
    originalLanguage,
    translations: {
      ...story.translations,
      [originalLanguage]: story.translations?.[originalLanguage] ?? {
        title: story.title,
        summary: story.summary,
        content: story.content,
        moralLesson: story.moralLesson,
      },
    },
  };
};

const buildSeedStories = (localStories: Story[]) => {
  const seedStories = new Map(
    starterStories.map((story) => [story.id, withPrimaryTranslation(story)]),
  );

  localStories.forEach((localStory) => {
    const existingStory = seedStories.get(localStory.id);
    const normalizedLocalStory = withPrimaryTranslation(localStory);
    seedStories.set(localStory.id, {
      ...existingStory,
      ...normalizedLocalStory,
      translations: {
        ...existingStory?.translations,
        ...normalizedLocalStory.translations,
      },
    });
  });

  return Array.from(seedStories.values());
};

const seedMissingStories = async (stories: Story[], existingStories: Story[]) => {
  if (!db) return;
  const firestore = db;

  const existingIds = new Set(existingStories.map((story) => story.id));
  const missingStories = stories.filter((story) => !existingIds.has(story.id));
  if (missingStories.length === 0) return;

  const batch = writeBatch(firestore);
  missingStories.forEach((story) => {
    batch.set(doc(firestore, collectionName, story.id), starterStoryToFirestoreStory(story), {
      merge: true,
    });
  });
  await batch.commit();
};

const fetchFirestoreStories = async (): Promise<Story[]> => {
  if (!db) return [];
  const firestore = db;

  const snapshot = await getDocs(
    query(collection(firestore, collectionName), orderBy("updatedAt", "desc")),
  );
  return snapshot.docs.map((storyDoc) =>
    mapFirestoreStory(storyDoc.id, storyDoc.data() as FirestoreStory),
  );
};

export const storyService = {
  async listStories(regionId?: RegionId): Promise<Story[]> {
    if (!db) {
      return readLocalStories()
        .filter((story) => (regionId ? story.regionId === regionId : true))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    const localStories = readPersistedLocalStories();
    let stories = await fetchFirestoreStories();
    const storiesToSeed = buildSeedStories(localStories);
    const hasMissingSeedStories = storiesToSeed.some(
      (seedStory) => !stories.some((story) => story.id === seedStory.id),
    );

    if (hasMissingSeedStories) {
      await seedMissingStories(storiesToSeed, stories);
      stories = await fetchFirestoreStories();
    }

    return stories.filter((story) => (regionId ? story.regionId === regionId : true));
  },

  async createStory(draft: StoryDraft): Promise<string> {
    if (!db) {
      const now = new Date();
      const story: Story = {
        ...draft,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      writeLocalStories([story, ...readLocalStories()]);
      return story.id;
    }

    const storyRef = await addDoc(collection(db, collectionName), {
      ...draft,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return storyRef.id;
  },

  async updateStory(storyId: string, draft: Partial<StoryDraft>): Promise<void> {
    if (!db) {
      writeLocalStories(
        readLocalStories().map((story) =>
          story.id === storyId ? { ...story, ...draft, updatedAt: new Date() } : story,
        ),
      );
      return;
    }

    await updateDoc(doc(db, collectionName, storyId), {
      ...draft,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteStory(storyId: string): Promise<void> {
    if (!db) {
      writeLocalStories(readLocalStories().filter((story) => story.id !== storyId));
      return;
    }

    await deleteDoc(doc(db, collectionName, storyId));
  },
};
