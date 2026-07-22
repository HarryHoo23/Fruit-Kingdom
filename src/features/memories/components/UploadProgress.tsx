import { useTranslation } from "react-i18next";
import type { MemoryUploadStage } from "../types";

type UploadProgressProps = {
  stage: MemoryUploadStage;
  progress: number;
};

export const UploadProgress = ({ stage, progress }: UploadProgressProps) => {
  const { t } = useTranslation();
  const label = t(`memories.upload.${stage}`);

  return (
    <div className="grid gap-2" role="status" aria-live="polite">
      <div className="flex items-center justify-between gap-3 text-sm font-black text-fruit-text">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-fruit-cardDashed" aria-hidden="true">
        <div
          className="h-full rounded-full bg-fruit-primary transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
