import { useTranslation } from "react-i18next";
import { MemoryBook } from "../features/memories/components/MemoryBook";
import { useMemories } from "../features/memories/hooks/useMemories";

export const MemoryHousePage = () => {
  const { t } = useTranslation();
  const { memories, loading } = useMemories();

  return (
    <section className="memory-house-page relative min-h-[calc(100vh-74px)] overflow-hidden px-[clamp(12px,3vw,42px)] pb-[clamp(32px,5vw,64px)] pt-[clamp(24px,4vw,48px)]">
      <div className="memory-sunbeam" aria-hidden="true" />
      <span
        className="memory-particle left-[9%] top-[24%] [animation-delay:0.4s]"
        aria-hidden="true"
      >
        ✦
      </span>
      <span
        className="memory-particle right-[11%] top-[35%] [animation-delay:1.3s]"
        aria-hidden="true"
      >
        ✧
      </span>
      <span
        className="memory-particle bottom-[17%] left-[17%] [animation-delay:2.1s]"
        aria-hidden="true"
      >
        ✦
      </span>

      <header className="memory-house-header relative z-[2] mx-auto max-w-3xl text-center">
        <p className="text-[13px] font-black uppercase tracking-[0.12em] text-fruit-primary">
          {t("memories.eyebrow")}
        </p>
        <h1 className="mt-2 text-[clamp(34px,5vw,64px)] font-black leading-[1.05] text-fruit-parchment text-shadow-fruit">
          🏡 {t("memories.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[clamp(14px,1.6vw,17px)] font-bold leading-relaxed text-fruit-muted">
          {t("memories.subtitle")}
        </p>
      </header>

      <div className="memory-book-area relative z-[2]">
        {loading ? (
          <p className="text-center font-black text-fruit-muted">{t("memories.loading")}</p>
        ) : (
          <MemoryBook memories={memories} />
        )}
      </div>
    </section>
  );
};
