import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadMetadata,
} from "firebase/storage";
import { storage } from "../../../lib/firebase";
import type { ProcessedImageResult } from "../types";

export type StorageUploadKind = "original" | "display" | "thumbnail";

export type UploadedMemoryFiles = {
  original: { storagePath: string; contentType: string; sizeBytes: number };
  displayImage: { storagePath: string; downloadUrl: string; sizeBytes: number };
  thumbnail: { storagePath: string; downloadUrl: string; sizeBytes: number };
};

const sanitiseFileName = (fileName: string) => {
  const extensionMatch = fileName.toLowerCase().match(/\.(jpe?g|png|webp)$/);
  const extension = extensionMatch?.[0] ?? "";
  const base = fileName
    .slice(0, extension ? -extension.length : undefined)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${base || "photo"}${extension}`;
};

const uploadBlob = (
  storagePath: string,
  data: Blob,
  metadata: UploadMetadata,
  onProgress: (progress: number) => void,
) => {
  if (!storage) return Promise.reject(new Error("Firebase Storage is not configured"));
  const uploadTask = uploadBytesResumable(ref(storage, storagePath), data, metadata);

  return new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => onProgress(snapshot.totalBytes ? snapshot.bytesTransferred / snapshot.totalBytes : 0),
      reject,
      resolve,
    );
  });
};

export const cleanupMemoryFiles = async (storagePaths: string[]) => {
  if (!storage) return;
  const firebaseStorage = storage;
  const results = await Promise.allSettled(
    storagePaths.map((storagePath) => deleteObject(ref(firebaseStorage, storagePath))),
  );
  const failedCount = results.filter((result) => result.status === "rejected").length;
  if (failedCount > 0) {
    console.error(`Memory upload cleanup failed for ${failedCount} private file(s).`);
  }
};

export const uploadMemoryFiles = async (
  familyId: string,
  memoryId: string,
  processed: ProcessedImageResult,
  onStage: (kind: StorageUploadKind, progress: number) => void,
): Promise<{ files: UploadedMemoryFiles; uploadedPaths: string[] }> => {
  if (!storage) throw new Error("Firebase Storage is not configured");
  const root = `families/${familyId}/memories/${memoryId}`;
  const originalPath = `${root}/original/${sanitiseFileName(processed.originalFile.name)}`;
  const displayPath = `${root}/display.webp`;
  const thumbnailPath = `${root}/thumbnail.webp`;
  const uploadedPaths: string[] = [];

  try {
    await uploadBlob(
      originalPath,
      processed.originalFile,
      { contentType: processed.originalFile.type },
      (progress) => onStage("original", progress),
    );
    uploadedPaths.push(originalPath);

    const webpMetadata: UploadMetadata = {
      contentType: "image/webp",
      cacheControl: "private,max-age=31536000,immutable",
    };
    await uploadBlob(displayPath, processed.displayBlob, webpMetadata, (progress) =>
      onStage("display", progress),
    );
    uploadedPaths.push(displayPath);

    await uploadBlob(thumbnailPath, processed.thumbnailBlob, webpMetadata, (progress) =>
      onStage("thumbnail", progress),
    );
    uploadedPaths.push(thumbnailPath);

    const [displayUrl, thumbnailUrl] = await Promise.all([
      getDownloadURL(ref(storage, displayPath)),
      getDownloadURL(ref(storage, thumbnailPath)),
    ]);

    return {
      files: {
        original: {
          storagePath: originalPath,
          contentType: processed.originalFile.type,
          sizeBytes: processed.originalSizeBytes,
        },
        displayImage: {
          storagePath: displayPath,
          downloadUrl: displayUrl,
          sizeBytes: processed.displaySizeBytes,
        },
        thumbnail: {
          storagePath: thumbnailPath,
          downloadUrl: thumbnailUrl,
          sizeBytes: processed.thumbnailSizeBytes,
        },
      },
      uploadedPaths,
    };
  } catch (error) {
    await cleanupMemoryFiles(uploadedPaths);
    throw error;
  }
};
