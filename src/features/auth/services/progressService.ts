import { doc, onSnapshot, updateDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { regions } from "../../regions/regionData";
import type { RegionId } from "../../../types/domain";

const defaultUnlockedRegionIds = regions.filter((region) => region.unlocked).map((region) => region.id);

export type FamilyProgress = {
  currentRegionId: RegionId;
  unlockedRegionIds: RegionId[];
};

const normaliseProgress = (data: Record<string, unknown>): FamilyProgress => {
  const storedUnlockedRegionIds = Array.isArray(data.unlockedRegionIds)
    ? data.unlockedRegionIds.filter((id): id is RegionId => regions.some((region) => region.id === id))
    : [];
  const unlockedRegionIds = [...new Set([...defaultUnlockedRegionIds, ...storedUnlockedRegionIds])];
  const currentRegionId = regions.some((region) => region.id === data.currentRegionId)
    ? (data.currentRegionId as RegionId)
    : unlockedRegionIds[0] ?? defaultUnlockedRegionIds[0];
  return { currentRegionId, unlockedRegionIds: [...new Set(unlockedRegionIds)] };
};

export const progressService = {
  defaultProgress(): FamilyProgress {
    return {
      currentRegionId: defaultUnlockedRegionIds[0],
      unlockedRegionIds: defaultUnlockedRegionIds,
    };
  },

  subscribe(uid: string, onNext: (progress: FamilyProgress) => void, onError: (error: Error) => void): Unsubscribe | undefined {
    if (!db) return undefined;
    return onSnapshot(
      doc(db, "users", uid),
      (snapshot) => onNext(normaliseProgress((snapshot.data() ?? {}) as Record<string, unknown>)),
      onError,
    );
  },

  async update(uid: string, changes: Partial<FamilyProgress>): Promise<void> {
    if (!db) return;
    await updateDoc(doc(db, "users", uid), changes);
  },
};
