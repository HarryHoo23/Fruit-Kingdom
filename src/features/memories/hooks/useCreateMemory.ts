import { useCallback, useEffect, useState } from "react";
import { calculateAgeInMonths } from "../../../config/childProfile";
import { useAuth } from "../../auth/useAuth";
import { createAuthorSnapshot } from "../../auth/utils";
import { cleanupMemoryFiles, uploadMemoryFiles } from "../services/memoryStorageService";
import { memoryService } from "../services/memoryService";
import type {
  CreateMemoryDetails,
  MemoryUploadStage,
  ProcessedImageResult,
} from "../types";

export const useCreateMemory = () => {
  const { profile } = useAuth();
  const [stage, setStage] = useState<MemoryUploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const uploading = !["idle", "complete"].includes(stage);

  useEffect(() => {
    if (!uploading) return;
    const preventLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", preventLeaving);
    return () => window.removeEventListener("beforeunload", preventLeaving);
  }, [uploading]);

  const createMemory = useCallback(
    async (details: CreateMemoryDetails, processed: ProcessedImageResult) => {
      if (!profile?.active) throw new Error("An active parent profile is required");
      setError(null);
      setStage("preparing");
      setProgress(0);

      const memoryId = memoryService.createMemoryId();
      const author = createAuthorSnapshot(profile);
      let uploadedPaths: string[] = [];

      try {
        const upload = await uploadMemoryFiles(
          profile.familyId,
          memoryId,
          processed,
          (kind, fileProgress) => {
            setStage(
              kind === "original"
                ? "uploadingOriginal"
                : kind === "display"
                  ? "uploadingDisplay"
                  : "uploadingThumbnail",
            );
            const offset = kind === "original" ? 0 : kind === "display" ? 34 : 67;
            setProgress(Math.min(99, Math.round(offset + fileProgress * 32)));
          },
        );
        uploadedPaths = upload.uploadedPaths;
        setStage("saving");
        setProgress(99);

        await memoryService.createMemory(memoryId, {
          ...details,
          ageInMonths: calculateAgeInMonths(details.capturedAt),
          original: upload.files.original,
          displayImage: {
            ...upload.files.displayImage,
            width: processed.displayWidth,
            height: processed.displayHeight,
          },
          thumbnail: {
            ...upload.files.thumbnail,
            width: processed.thumbnailWidth,
            height: processed.thumbnailHeight,
          },
          createdBy: author,
          updatedBy: author,
          uploadedBy: author,
        });
        setStage("complete");
        setProgress(100);
        return memoryId;
      } catch (nextError) {
        if (uploadedPaths.length > 0) await cleanupMemoryFiles(uploadedPaths);
        const uploadError = nextError instanceof Error ? nextError : new Error("Upload failed");
        setError(uploadError);
        setStage("idle");
        setProgress(0);
        throw uploadError;
      }
    },
    [profile],
  );

  return { createMemory, stage, progress, uploading, error };
};
