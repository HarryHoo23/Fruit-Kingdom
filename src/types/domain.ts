export type RegionId =
  | "apple-forest"
  | "strawberry-castle"
  | "banana-beach"
  | "watermelon-lake"
  | "grape-valley"
  | "kiwi-rainforest"
  | "orange-volcano"
  | "coconut-island";

export interface Region {
  id: RegionId;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  characterId: string;
  mapPosition: {
    top: string;
    left: string;
  };
  theme: {
    pinBorder: string;
    heroBg: string;
    artBg: string;
  };
}

export interface Character {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  introduction: string;
  homeRegionId: RegionId;
}

export interface Story {
  id: string;
  title: string;
  regionId: RegionId;
  summary: string;
  content: string;
  moralLesson: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryDraft {
  title: string;
  regionId: RegionId;
  summary: string;
  content: string;
  moralLesson: string;
}

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
  accent: {
    border: string;
    text: string;
  };
}
