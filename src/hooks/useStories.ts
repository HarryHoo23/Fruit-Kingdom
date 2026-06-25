import { useCallback, useEffect, useState } from "react";
import { storyService } from "../services/storyService";
import type { RegionId, Story, StoryDraft } from "../types/domain";

export const useStories = (regionId?: RegionId) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStories(await storyService.listStories(regionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load stories.");
    } finally {
      setLoading(false);
    }
  }, [regionId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createStory = async (draft: StoryDraft) => {
    await storyService.createStory(draft);
    await refresh();
  };

  const updateStory = async (storyId: string, draft: Partial<StoryDraft>) => {
    await storyService.updateStory(storyId, draft);
    await refresh();
  };

  const deleteStory = async (storyId: string) => {
    await storyService.deleteStory(storyId);
    await refresh();
  };

  return { stories, loading, error, createStory, updateStory, deleteStory, refresh };
};
