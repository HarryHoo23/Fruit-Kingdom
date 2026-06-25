import type { Sticker } from "../../types/domain";

export const stickers: Sticker[] = [
  {
    id: "courage-star",
    emoji: "⭐",
    earned: true,
    accent: {
      border: "border-fruit-banana",
      text: "text-fruit-banana",
    },
  },
  {
    id: "kindness-heart",
    emoji: "❤️",
    earned: true,
    accent: {
      border: "border-fruit-apple",
      text: "text-fruit-apple",
    },
  },
  {
    id: "sharing-rainbow",
    emoji: "🌈",
    earned: true,
    accent: {
      border: "border-fruit-teal",
      text: "text-fruit-teal",
    },
  },
  {
    id: "wisdom-book",
    emoji: "📚",
    earned: false,
    accent: {
      border: "border-fruit-blue",
      text: "text-fruit-blue",
    },
  },
  {
    id: "sleepy-moon",
    emoji: "🌙",
    earned: false,
    accent: {
      border: "border-fruit-grape",
      text: "text-fruit-grape",
    },
  },
];
