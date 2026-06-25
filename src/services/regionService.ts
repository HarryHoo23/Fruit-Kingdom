import { regions } from "../features/regions/regionData";
import type { Region, RegionId } from "../types/domain";

export const regionService = {
  async listRegions(): Promise<Region[]> {
    return regions;
  },

  async getRegion(regionId: RegionId): Promise<Region | undefined> {
    return regions.find((region) => region.id === regionId);
  },
};
