import type { Sticker } from "../../types/domain";

export const stickers: Sticker[] = [
  {
    id: "courage-star",
    name: "Courage Star",
    emoji: "⭐",
    description: "Earned for trying something brave.",
    earned: true,
    accent: {
      border: "border-fruit-banana",
      text: "text-fruit-banana",
    },
  },
  {
    id: "kindness-heart",
    name: "Kindness Heart",
    emoji: "❤️",
    description: "Earned for helping a friend feel seen.",
    earned: true,
    accent: {
      border: "border-fruit-apple",
      text: "text-fruit-apple",
    },
  },
  {
    id: "sharing-rainbow",
    name: "Sharing Rainbow",
    emoji: "🌈",
    description: "Earned for making joy bigger by sharing it.",
    earned: true,
    accent: {
      border: "border-fruit-teal",
      text: "text-fruit-teal",
    },
  },
  {
    id: "wisdom-book",
    name: "Wisdom Book",
    emoji: "📚",
    description: "Earned for asking a thoughtful question.",
    earned: false,
    accent: {
      border: "border-fruit-blue",
      text: "text-fruit-blue",
    },
  },
  {
    id: "sleepy-moon",
    name: "Sleepy Moon",
    emoji: "🌙",
    description: "Earned for closing an adventure with a peaceful heart.",
    earned: false,
    accent: {
      border: "border-fruit-grape",
      text: "text-fruit-grape",
    },
  },
];
