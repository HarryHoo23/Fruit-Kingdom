import { useCallback, useEffect, useState } from "react";
import {
  ImageProcessingError,
  processImage,
  type ImageProcessingErrorCode,
} from "../services/imageProcessingService";
import type { ProcessedImageResult } from "../types";

export const useMemoryUpload = () => {
  const [processedImage, setProcessedImage] = useState<ProcessedImageResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorCode, setErrorCode] = useState<ImageProcessingErrorCode | null>(null);

  const removePhoto = useCallback(() => {
    setProcessedImage(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setErrorCode(null);
  }, []);

  const selectPhoto = useCallback(async (file: File) => {
    setProcessing(true);
    setErrorCode(null);
    setProcessedImage(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });

    try {
      setProcessedImage(await processImage(file));
    } catch (error) {
      setProcessedImage(null);
      setErrorCode(error instanceof ImageProcessingError ? error.code : "decode");
    } finally {
      setProcessing(false);
    }
  }, []);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  return { processedImage, previewUrl, processing, errorCode, selectPhoto, removePhoto };
};
