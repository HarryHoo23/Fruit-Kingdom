import type { Region } from "../../types/domain";

export const regions: Region[] = [
  {
    id: "apple-forest",
    emoji: "🍎",
    unlocked: true,
    characterId: "apple-king",
    mapPosition: { top: "18%", left: "17%" },
    theme: {
      pinBorder: "border-fruit-apple",
      heroBg: "bg-region-apple",
      artBg: "bg-region-art-apple",
    },
  },
  {
    id: "strawberry-castle",
    emoji: "🍓",
    unlocked: true,
    characterId: "strawberry-princess",
    mapPosition: { top: "22%", left: "57%" },
    theme: {
      pinBorder: "border-fruit-strawberry",
      heroBg: "bg-region-strawberry",
      artBg: "bg-region-art-strawberry",
    },
  },
  {
    id: "banana-beach",
    emoji: "🍌",
    unlocked: true,
    characterId: "banana-sheriff",
    mapPosition: { top: "59%", left: "12%" },
    theme: {
      pinBorder: "border-fruit-banana",
      heroBg: "bg-region-banana",
      artBg: "bg-region-art-banana",
    },
  },
  {
    id: "watermelon-lake",
    emoji: "🍉",
    unlocked: true,
    characterId: "watermelon-giant",
    mapPosition: { top: "51%", left: "42%" },
    theme: {
      pinBorder: "border-fruit-teal",
      heroBg: "bg-region-watermelon",
      artBg: "bg-region-art-watermelon",
    },
  },
  {
    id: "grape-valley",
    emoji: "🍇",
    unlocked: true,
    characterId: "grape-wizard",
    mapPosition: { top: "43%", left: "73%" },
    theme: {
      pinBorder: "border-fruit-grape",
      heroBg: "bg-region-grape",
      artBg: "bg-region-art-grape",
    },
  },
  {
    id: "kiwi-rainforest",
    emoji: "🥝",
    unlocked: false,
    characterId: "kiwi-professor",
    mapPosition: { top: "75%", left: "30%" },
    theme: {
      pinBorder: "border-fruit-kiwi",
      heroBg: "bg-region-kiwi",
      artBg: "bg-region-art-kiwi",
    },
  },
  {
    id: "orange-volcano",
    emoji: "🍊",
    unlocked: false,
    characterId: "orange-volcano-keeper",
    mapPosition: { top: "71%", left: "62%" },
    theme: {
      pinBorder: "border-fruit-orange",
      heroBg: "bg-region-orange",
      artBg: "bg-region-art-orange",
    },
  },
  {
    id: "coconut-island",
    emoji: "🥥",
    unlocked: false,
    characterId: "coconut-captain",
    mapPosition: { top: "79%", left: "84%" },
    theme: {
      pinBorder: "border-fruit-coconut",
      heroBg: "bg-region-coconut",
      artBg: "bg-region-art-coconut",
    },
  },
];
