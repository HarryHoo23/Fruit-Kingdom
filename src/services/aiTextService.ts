import { apiClient } from "../lib/apiClient";

interface GenerateTextOptions {
  prompt: string;
  system?: string;
}

interface GenerateTextResponse {
  text: string;
}

export const generateText = async ({ prompt, system }: GenerateTextOptions): Promise<string> => {
  const response = await apiClient.post<GenerateTextResponse>("api/generate-text", { prompt, system });
  const payload = response.data;
  return payload.text;
};
