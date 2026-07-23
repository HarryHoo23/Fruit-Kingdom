import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import { progressService, type FamilyProgress } from "../services/progressService";
import type { RegionId, Story } from "../../../types/domain";
import { regions } from "../../regions/regionData";

const storiesPerUnlock = 3;

export const useKingdomProgress = (stories: Story[] = []) => {
  const { profile } = useAuth();
  const [progress, setProgress] = useState<FamilyProgress>(progressService.defaultProgress());
  const [progressError, setProgressError] = useState<Error | null>(null);

  const toError = (error: unknown) =>
    error instanceof Error ? error : new Error(String(error));

  useEffect(() => {
    if (!profile?.active) return;
    setProgressError(null);
    return progressService.subscribe(profile.uid, setProgress, (error) => {
      console.error("[kingdom-progress] subscription failed", error);
      setProgressError(toError(error));
    });
  }, [profile?.active, profile?.uid]);

  useEffect(() => {
    if (!profile?.active || stories.length === 0) return;
    const baseline = regions.filter((region) => region.unlocked).map((region) => region.id);
    const unlockCount = Math.min(
      regions.length,
      baseline.length + Math.floor(stories.length / storiesPerUnlock),
    );
    const unlockedRegionIds = regions.slice(0, unlockCount).map((region) => region.id);
    if (unlockedRegionIds.join(",") === progress.unlockedRegionIds.join(",")) return;
    setProgress((current) => ({ ...current, unlockedRegionIds }));
    void progressService.update(profile.uid, { unlockedRegionIds }).catch((error) => {
      console.error("[kingdom-progress] failed to save unlocked regions", error);
      setProgressError(toError(error));
    });
  }, [profile?.active, profile?.uid, progress.unlockedRegionIds, stories.length]);

  const setCurrentRegion = useCallback((regionId: RegionId) => {
    if (!progress.unlockedRegionIds.includes(regionId) || !profile?.active) return;
    setProgress((current) => ({ ...current, currentRegionId: regionId }));
    setProgressError(null);
    void progressService.update(profile.uid, { currentRegionId: regionId }).catch((error) => {
      console.error("[kingdom-progress] failed to save current region", error);
      setProgressError(toError(error));
    });
  }, [profile?.active, profile?.uid, progress.unlockedRegionIds]);

  return { ...progress, progressError, setCurrentRegion };
};
