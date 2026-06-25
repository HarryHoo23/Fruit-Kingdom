import { useTranslation } from "react-i18next";
import { AnimalCard } from "../components/AnimalCard";
import { stickers } from "../features/stickers/stickerData";
import { useBedtime } from "../hooks/useBedtime";
import { toTranslationKey } from "../i18n/keys";

export const CollectionPage = () => {
  const { bedtime } = useBedtime();
  const { t } = useTranslation();

  return (
    <section className="min-h-[calc(100vh-74px)] px-[clamp(16px,4vw,48px)] pb-14 pt-8">
      <div className="mx-auto mb-[26px] max-w-[720px] text-center">
        <p className="mb-2 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
          {bedtime ? t("badges.nightEyebrow") : t("badges.dayEyebrow")}
        </p>
        <h1 className="mb-3 text-[clamp(42px,6vw,70px)] font-black leading-none text-fruit-parchment text-shadow-fruit">
          {t("badges.heading")}
        </h1>
        <p className="text-[17px] leading-[1.7] text-fruit-muted">{t("badges.intro")}</p>
      </div>

      <div className="mx-auto grid max-w-[1080px] grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
        {stickers.map((sticker, index) => (
          <AnimalCard
            key={sticker.id}
            className={`grid min-h-[242px] content-center justify-items-center text-center ${!sticker.earned ? "opacity-70 saturate-50" : ""}`}
            pattern={index % 2 === 0 ? "yellow" : "blue"}
          >
            <div
              className={`mb-4 grid size-[82px] place-items-center rounded-[28px] border-4 ${sticker.accent.border} bg-fruit-paper text-[44px] shadow-sticker-lift`}
            >
              {sticker.earned ? sticker.emoji : "🔒"}
            </div>
            <h2 className="mb-2.5 text-[26px] font-black leading-[1.15] text-fruit-text">
              {t(`badges.${toTranslationKey(sticker.id)}.name`)}
            </h2>
            <p className="text-[17px] leading-[1.7] text-fruit-muted">
              {t(`badges.${toTranslationKey(sticker.id)}.description`)}
            </p>
            <span className={`mt-2 font-black ${sticker.accent.text}`}>
              {sticker.earned ? t("badges.earned") : t("badges.hidden")}
            </span>
          </AnimalCard>
        ))}
      </div>
    </section>
  );
};
