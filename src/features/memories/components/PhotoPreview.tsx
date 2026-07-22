import { RefreshCw, Trash2 } from "lucide-react";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { ProcessedImageResult } from "../types";

type PhotoPreviewProps = {
  previewUrl: string;
  processed: ProcessedImageResult;
  disabled?: boolean;
  onReplace: (file: File) => void;
  onRemove: () => void;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const PhotoPreview = ({
  previewUrl,
  processed,
  disabled = false,
  onReplace,
  onRemove,
}: PhotoPreviewProps) => {
  const { t } = useTranslation();
  const inputId = useId();

  return (
    <div className="grid gap-4">
      <figure className="overflow-hidden rounded-fruit border-2 border-fruit-cardBorder bg-fruit-paper shadow-fruit">
        <img
          src={previewUrl}
          alt={t("memories.upload.previewAlt")}
          className="max-h-[430px] w-full object-contain"
        />
      </figure>
      <div className="grid gap-2 rounded-fruit border border-fruit-cardDashed bg-fruit-parchment/70 p-4 text-sm font-bold text-fruit-muted">
        <p className="break-all font-black text-fruit-text">{processed.originalFile.name}</p>
        <p>
          {processed.width} × {processed.height}
        </p>
        <div className="grid grid-cols-3 gap-2 max-[560px]:grid-cols-1">
          <span>{t("memories.upload.originalSize")}: {formatBytes(processed.originalSizeBytes)}</span>
          <span>{t("memories.upload.optimisedSize")}: {formatBytes(processed.displaySizeBytes)}</span>
          <span>{t("memories.upload.thumbnailSize")}: {formatBytes(processed.thumbnailSizeBytes)}</span>
        </div>
      </div>
      <div className="flex gap-3 max-[560px]:grid max-[560px]:grid-cols-2">
        <label
          htmlFor={inputId}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-fruit-border bg-fruit-paper px-5 font-black text-fruit-brown shadow-fruit-sm transition hover:shadow-fruit focus-within:ring-4 focus-within:ring-fruit-inputFocus/40"
        >
          <RefreshCw size={18} aria-hidden="true" />
          {t("memories.upload.replacePhoto")}
          <input
            id={inputId}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onReplace(file);
              event.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-fruit-danger bg-fruit-paper px-5 font-black text-fruit-danger shadow-fruit-sm transition hover:shadow-fruit focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-danger/30"
          disabled={disabled}
          onClick={onRemove}
        >
          <Trash2 size={18} aria-hidden="true" />
          {t("memories.upload.removePhoto")}
        </button>
      </div>
    </div>
  );
};
