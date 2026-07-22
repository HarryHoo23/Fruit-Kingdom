import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ImageProcessingStatus = () => {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[180px] items-center justify-center gap-3 font-black text-fruit-muted" role="status" aria-live="polite">
      <LoaderCircle className="animate-spin" size={24} aria-hidden="true" />
      {t("memories.upload.optimising")}
    </div>
  );
};
