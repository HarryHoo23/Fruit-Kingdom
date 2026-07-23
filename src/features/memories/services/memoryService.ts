import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import type { AuthorSnapshot, Memory, MemoryDraft, MemoryStatus } from "../types";

const collectionName = "memories";

const mapMemory = (id: string, data: DocumentData): Memory => ({
  id,
  title: data.title,
  description: data.description,
  parentMessage: data.parentMessage,
  capturedAt: data.capturedAt instanceof Timestamp ? data.capturedAt.toDate() : new Date(),
  ageInMonths: data.ageInMonths,
  regionId: data.regionId ?? null,
  milestoneId: data.milestoneId ?? null,
  tags: Array.isArray(data.tags) ? data.tags : [],
  location: data.location ?? null,
  original: data.original,
  displayImage: data.displayImage,
  thumbnail: data.thumbnail,
  status: data.status as MemoryStatus,
  createdBy: data.createdBy,
  updatedBy: data.updatedBy,
  uploadedBy: data.uploadedBy,
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
  updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
});

const activeMemoriesQuery = () => {
  if (!db) throw new Error("Firestore is not configured");
  return query(collection(db, collectionName), where("status", "==", "active"));
};

const mapAndSortMemories = (documents: Array<{ id: string; data: () => DocumentData }>) =>
  documents
    .map((memoryDoc) => mapMemory(memoryDoc.id, memoryDoc.data()))
    .sort((left, right) => left.capturedAt.getTime() - right.capturedAt.getTime());

export const memoryService = {
  createMemoryId() {
    if (!db) throw new Error("Firestore is not configured");
    return doc(collection(db, collectionName)).id;
  },

  async getMemories(): Promise<Memory[]> {
    const snapshot = await getDocs(activeMemoriesQuery());
    return mapAndSortMemories(snapshot.docs);
  },

  async getMemoryById(memoryId: string): Promise<Memory | null> {
    if (!db) throw new Error("Firestore is not configured");
    const snapshot = await getDoc(doc(db, collectionName, memoryId));
    return snapshot.exists() ? mapMemory(snapshot.id, snapshot.data()) : null;
  },

  async createMemory(memoryId: string, draft: MemoryDraft): Promise<void> {
    if (!db) throw new Error("Firestore is not configured");
    await setDoc(doc(db, collectionName, memoryId), {
      ...draft,
      capturedAt: Timestamp.fromDate(draft.capturedAt),
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async updateMemory(
    memoryId: string,
    changes: Partial<Pick<Memory, "title" | "description" | "parentMessage" | "capturedAt" | "ageInMonths" | "regionId" | "milestoneId" | "tags" | "location">>,
    updatedBy: AuthorSnapshot,
  ): Promise<void> {
    if (!db) throw new Error("Firestore is not configured");
    const firestoreChanges: Record<string, unknown> = { ...changes };
    if (changes.capturedAt) firestoreChanges.capturedAt = Timestamp.fromDate(changes.capturedAt);
    await updateDoc(doc(db, collectionName, memoryId), {
      ...firestoreChanges,
      updatedBy,
      updatedAt: serverTimestamp(),
    });
  },

  async archiveMemory(memoryId: string, updatedBy: AuthorSnapshot): Promise<void> {
    if (!db) throw new Error("Firestore is not configured");
    await updateDoc(doc(db, collectionName, memoryId), {
      status: "archived",
      updatedBy,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteMemory(memoryId: string, updatedBy: AuthorSnapshot): Promise<void> {
    if (!db) throw new Error("Firestore is not configured");
    await updateDoc(doc(db, collectionName, memoryId), {
      status: "archived",
      description: "",
      parentMessage: "",
      updatedBy,
      updatedAt: serverTimestamp(),
    });
  },

  subscribeToActiveMemories(
    onNext: (memories: Memory[]) => void,
    onError: (error: Error) => void,
  ): Unsubscribe {
    return onSnapshot(
      activeMemoriesQuery(),
      (snapshot) => onNext(mapAndSortMemories(snapshot.docs)),
      onError,
    );
  },
};
