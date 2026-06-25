export type RegionId =
  | "apple-forest"
  | "strawberry-castle"
  | "banana-beach"
  | "watermelon-lake"
  | "grape-valley"
  | "kiwi-rainforest"
  | "orange-volcano"
  | "coconut-island";

export type StoryLanguage = "en" | "zh";

export interface StoryText {
  title: string;
  summary: string;
  content: string;
  moralLesson: string;
}

export type StoryTranslations = Partial<Record<StoryLanguage, StoryText>>;

export interface Region {
  id: RegionId;
  emoji: string;
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
  emoji: string;
  homeRegionId: RegionId;
}

export interface Story extends StoryText {
  id: string;
  regionId: RegionId;
  originalLanguage?: StoryLanguage;
  translations?: StoryTranslations;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryDraft extends StoryText {
  regionId: RegionId;
  originalLanguage?: StoryLanguage;
  translations?: StoryTranslations;
}

export interface Sticker {
  id: string;
  emoji: string;
  earned: boolean;
  accent: {
    border: string;
    text: string;
  };
}
