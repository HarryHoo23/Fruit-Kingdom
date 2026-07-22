import { useTranslation } from "react-i18next";
import { MemoryUploadForm } from "../features/memories/components/MemoryUploadForm";

export const MemoryUploadPage = () => {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-5xl px-[clamp(16px,4vw,48px)] pb-16 pt-8">
      <header className="mb-6">
        <p className="text-[13px] font-black uppercase tracking-[0.08em] text-fruit-primary">
          {t("memories.eyebrow")}
        </p>
        <h1 className="mt-2 text-[clamp(34px,5vw,58px)] font-black leading-none text-fruit-parchment text-shadow-fruit">
          {t("memories.upload.title")}
        </h1>
        <p className="mt-3 max-w-2xl font-bold leading-relaxed text-fruit-muted">
          {t("memories.upload.description")}
        </p>
      </header>
      <MemoryUploadForm />
    </section>
  );
};
