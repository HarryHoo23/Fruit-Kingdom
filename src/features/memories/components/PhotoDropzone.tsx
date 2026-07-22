import { ImagePlus } from "lucide-react";
import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useTranslation } from "react-i18next";

type PhotoDropzoneProps = {
  disabled?: boolean;
  onSelect: (file: File) => void;
};

export const PhotoDropzone = ({ disabled = false, onSelect }: PhotoDropzoneProps) => {
  const { t } = useTranslation();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const selectFirstFile = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onSelect(file);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFirstFile(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled) selectFirstFile(event.dataTransfer.files);
  };

  return (
    <div
      className={`grid min-h-[260px] place-items-center rounded-fruit border-2 border-dashed p-6 text-center transition ${dragging ? "border-fruit-inputFocus bg-fruit-tealLight" : "border-fruit-cardBorder bg-fruit-input"}`}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <div className="grid justify-items-center gap-3">
        <span className="grid size-16 place-items-center rounded-full bg-fruit-tealLight text-fruit-primary">
          <ImagePlus size={32} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <div>
          <p className="text-lg font-black text-fruit-text">{t("memories.upload.choosePhoto")}</p>
          <p className="mt-1 text-sm font-bold text-fruit-soft">{t("memories.upload.dragDrop")}</p>
        </div>
        <label
          htmlFor={inputId}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border-2 border-fruit-primary bg-fruit-primary px-5 font-black text-fruit-paper shadow-fruit transition hover:-translate-y-px focus-within:ring-4 focus-within:ring-fruit-inputFocus/40"
        >
          {t("memories.upload.browse")}
          <input
            ref={inputRef}
            id={inputId}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={disabled}
            onChange={handleChange}
          />
        </label>
        <p className="text-xs font-bold text-fruit-soft">{t("memories.upload.fileHelp")}</p>
      </div>
    </div>
  );
};
