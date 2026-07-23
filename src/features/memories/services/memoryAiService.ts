import { apiClient } from "../../../lib/apiClient";

type MemoryDescription = {
  title: string;
  description: string;
  tags: string[];
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read the selected photo"));
    reader.readAsDataURL(blob);
  });

export const generateMemoryDescription = async (
  image: Blob,
  language: "en" | "zh",
): Promise<MemoryDescription> => {
  const response = await apiClient.post<MemoryDescription>("api/generate-memory-description", {
    imageDataUrl: await blobToDataUrl(image),
    language,
  });
  const payload = response.data;
  return {
    title: payload.title,
    description: payload.description,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
  };
};
