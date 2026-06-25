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
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { starterStories } from "../features/stories/storySeeds";
import type { RegionId, Story, StoryDraft } from "../types/domain";

const collectionName = "stories";

interface FirestoreStory {
  title: string;
  regionId: RegionId;
  summary: string;
  content: string;
  moralLesson: string;
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
      createdAt: new Date(story.createdAt),
      updatedAt: new Date(story.updatedAt),
    }));
  } catch {
    return starterStories;
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
  createdAt: data.createdAt?.toDate() ?? new Date(),
  updatedAt: data.updatedAt?.toDate() ?? new Date(),
});

export const storyService = {
  async listStories(regionId?: RegionId): Promise<Story[]> {
    if (!db) {
      return readLocalStories()
        .filter((story) => (regionId ? story.regionId === regionId : true))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    const constraints = regionId
      ? [where("regionId", "==", regionId), orderBy("updatedAt", "desc")]
      : [orderBy("updatedAt", "desc")];
    const snapshot = await getDocs(query(collection(db, collectionName), ...constraints));
    return snapshot.docs.map((storyDoc) =>
      mapFirestoreStory(storyDoc.id, storyDoc.data() as FirestoreStory),
    );
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
