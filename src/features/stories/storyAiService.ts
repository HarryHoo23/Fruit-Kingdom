import { apiClient } from "../../lib/apiClient";
import type { StoryLanguage, StoryText } from "../../types/domain";

export const generateStory = async (prompt: string, language: StoryLanguage): Promise<StoryText> => {
  const response = await apiClient.post<StoryText>("api/generate-story", { prompt, language });
  return response.data;
};
