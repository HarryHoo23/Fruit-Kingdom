import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

export const HaileyIntroPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();

  return (
    <div ref={ref} className="memory-book-page memory-book-paper memory-book-page-right">
      <div className="memory-page-content grid content-center text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-fruit-strawberryLight text-4xl shadow-fruit" aria-hidden="true">
          🌼
        </span>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.14em] text-fruit-primary">
          {t("memories.haileyIntroEyebrow")}
        </p>
        <h2 className="mt-2 text-[clamp(30px,4vw,48px)] font-black leading-none text-fruit-text">
          {t("memories.haileyIntroTitle")}
        </h2>
        <p className="mx-auto mt-5 max-w-sm text-[clamp(12px,1.5vw,15px)] font-bold leading-relaxed text-fruit-muted">
          {t("memories.haileyIntroDescription")}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-[clamp(11px,1.35vw,14px)] font-black leading-relaxed text-fruit-primary">
          {t("memories.haileyIntroMessage")}
        </p>
      </div>
      <span className="memory-page-number" aria-hidden="true">2</span>
    </div>
  );
});

HaileyIntroPage.displayName = "HaileyIntroPage";
