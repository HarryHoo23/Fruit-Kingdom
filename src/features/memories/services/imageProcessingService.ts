import type { ProcessedImageResult } from "../types";

export const imageProcessingConfig = {
  maxOriginalSizeBytes: 25 * 1024 * 1024,
  supportedTypes: ["image/jpeg", "image/png", "image/webp"],
  displayMaxLongEdge: 2560,
  displayQuality: 0.88,
  thumbnailMaxLongEdge: 640,
  thumbnailQuality: 0.8,
} as const;

export type ImageProcessingErrorCode =
  | "empty"
  | "fileTooLarge"
  | "unsupportedType"
  | "heicUnsupported"
  | "decode"
  | "webp";

export class ImageProcessingError extends Error {
  code: ImageProcessingErrorCode;

  constructor(code: ImageProcessingErrorCode) {
    super(code);
    this.name = "ImageProcessingError";
    this.code = code;
  }
}

type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
};

const isHeic = (file: File) =>
  ["image/heic", "image/heif"].includes(file.type.toLowerCase()) ||
  /\.(heic|heif)$/i.test(file.name);

export const validateImageFile = (file: File) => {
  if (file.size === 0) throw new ImageProcessingError("empty");
  if (file.size > imageProcessingConfig.maxOriginalSizeBytes) {
    throw new ImageProcessingError("fileTooLarge");
  }
  if (isHeic(file)) throw new ImageProcessingError("heicUnsupported");
  if (!imageProcessingConfig.supportedTypes.includes(file.type as never)) {
    throw new ImageProcessingError("unsupportedType");
  }
};

const decodeWithImageElement = (file: File): Promise<DecodedImage> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () =>
      resolve({
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        release: () => URL.revokeObjectURL(objectUrl),
      });
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new ImageProcessingError("decode"));
    };
    image.src = objectUrl;
  });

const decodeImage = async (file: File): Promise<DecodedImage> => {
  if ("createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch {
      // The image element fallback handles browsers with partial bitmap support.
    }
  }

  return decodeWithImageElement(file);
};

const dimensionsWithin = (width: number, height: number, maxLongEdge: number) => {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxLongEdge) return { width, height };
  const ratio = maxLongEdge / longEdge;
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
};

const encodeWebp = (
  source: CanvasImageSource,
  width: number,
  height: number,
  quality: number,
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new ImageProcessingError("webp");
  context.drawImage(source, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        canvas.width = 0;
        canvas.height = 0;
        if (!blob || blob.type !== "image/webp") {
          reject(new ImageProcessingError("webp"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
};

export const processImage = async (file: File): Promise<ProcessedImageResult> => {
  validateImageFile(file);
  let decoded: DecodedImage;
  try {
    decoded = await decodeImage(file);
  } catch (error) {
    if (error instanceof ImageProcessingError) throw error;
    throw new ImageProcessingError("decode");
  }

  try {
    if (decoded.width <= 0 || decoded.height <= 0) throw new ImageProcessingError("decode");
    const display = dimensionsWithin(
      decoded.width,
      decoded.height,
      imageProcessingConfig.displayMaxLongEdge,
    );
    const thumbnail = dimensionsWithin(
      decoded.width,
      decoded.height,
      imageProcessingConfig.thumbnailMaxLongEdge,
    );
    const [displayBlob, thumbnailBlob] = await Promise.all([
      encodeWebp(
        decoded.source,
        display.width,
        display.height,
        imageProcessingConfig.displayQuality,
      ),
      encodeWebp(
        decoded.source,
        thumbnail.width,
        thumbnail.height,
        imageProcessingConfig.thumbnailQuality,
      ),
    ]);

    return {
      originalFile: file,
      displayBlob,
      thumbnailBlob,
      width: decoded.width,
      height: decoded.height,
      displayWidth: display.width,
      displayHeight: display.height,
      thumbnailWidth: thumbnail.width,
      thumbnailHeight: thumbnail.height,
      originalSizeBytes: file.size,
      displaySizeBytes: displayBlob.size,
      thumbnailSizeBytes: thumbnailBlob.size,
    };
  } finally {
    decoded.release();
  }
};
