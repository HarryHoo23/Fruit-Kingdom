import { useEffect, useState } from "react";
import { memoryService } from "../services/memoryService";
import type { Memory } from "../types";

export const useMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = memoryService.subscribeToActiveMemories(
        (nextMemories) => {
          setMemories(nextMemories);
          setError(null);
          setLoading(false);
        },
        (nextError) => {
          setError(nextError);
          setLoading(false);
        },
      );
      return unsubscribe;
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError : new Error("Unable to load memories"));
      setLoading(false);
      return undefined;
    }
  }, []);

  return { memories, loading, error };
};
