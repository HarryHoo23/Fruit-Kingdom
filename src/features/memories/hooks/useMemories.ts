import { mockMemories } from "../data/mockMemories";

export const useMemories = () => {
  // TODO: Replace mockMemories with a Firestore-backed query.
  return { memories: mockMemories, loading: false };
};
