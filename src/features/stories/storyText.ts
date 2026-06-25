import type { Story, StoryLanguage, StoryText } from "../../types/domain";

export const emptyStoryText = (): StoryText => ({
  title: "",
  summary: "",
  content: "",
  moralLesson: "",
});

export const getCurrentStoryLanguage = (language?: string): StoryLanguage =>
  language?.startsWith("zh") ? "zh" : "en";

export const getStoryText = (story: Story, language: StoryLanguage): StoryText => {
  const translation = story.translations?.[language];

  return {
    title: translation?.title?.trim() || story.title,
    summary: translation?.summary?.trim() || story.summary,
    content: translation?.content?.trim() || story.content,
    moralLesson: translation?.moralLesson?.trim() || story.moralLesson,
  };
};

export const hasStoryText = (text: StoryText) =>
  Boolean(
    text.title.trim() || text.summary.trim() || text.content.trim() || text.moralLesson.trim(),
  );

export const isCompleteStoryText = (text: StoryText) =>
  Boolean(
    text.title.trim() && text.summary.trim() && text.content.trim() && text.moralLesson.trim(),
  );
