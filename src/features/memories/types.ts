import type { RegionId } from "../../types/domain";

export type MemoryLocale = "en" | "zh";
export type LocalizedMemoryText = Record<MemoryLocale, string>;

export type Memory = {
  id: string;
  title: LocalizedMemoryText;
  description: LocalizedMemoryText;
  fruitKingdomStory: LocalizedMemoryText;
  parentMessage: LocalizedMemoryText;
  date: string;
  ageLabel: LocalizedMemoryText;
  regionId: RegionId;
  photo: string;
  photoPosition: string;
  photoScale: number;
  author: "Dad" | "Mum";
};

export type MemoryCategory = {
  regionId: RegionId;
  emoji: string;
  memoryCount: number;
  startPage: number;
  endPage: number;
  targetPageIndex: number;
};
