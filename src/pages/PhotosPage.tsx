import { useTranslation } from "react-i18next";
import { KingdomPhotoCarousel } from "../components/PhotoCarousel/KingdomPhotoCarousel";

export const PhotosPage = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[calc(100vh-74px)] overflow-hidden px-[clamp(16px,4vw,56px)] pb-14 pt-[clamp(32px,5vw,64px)]">
      <div
        className="pointer-events-none absolute left-[8%] top-[12%] size-44 rounded-full bg-fruit-strawberry/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[8%] right-[6%] size-56 rounded-full bg-fruit-river/20 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative z-[1] mx-auto mb-[clamp(24px,4vw,46px)] max-w-3xl text-center">
        <p className="mb-2 text-[13px] font-black uppercase tracking-[0.12em] text-fruit-primary">
          {t("photos.eyebrow")}
        </p>
        <h1 className="text-[clamp(38px,6vw,70px)] font-black leading-none text-fruit-parchment text-shadow-fruit">
          {t("photos.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[clamp(15px,1.8vw,18px)] font-bold leading-relaxed text-fruit-muted">
          {t("photos.subtitle")}
        </p>
      </header>

      <KingdomPhotoCarousel />
    </section>
  );
};
