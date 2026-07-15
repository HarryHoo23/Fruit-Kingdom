import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimalCard } from "../components/AnimalCard";
import { FloatingClouds } from "../components/FloatingClouds";
import { KingdomMap } from "../components/KingdomMap/KingdomMap";
import { regions } from "../features/regions/regionData";
import { getCurrentStoryLanguage, getStoryText } from "../features/stories/storyText";
import { useBedtime } from "../hooks/useBedtime";
import { useStories } from "../hooks/useStories";
import { toTranslationKey } from "../i18n/keys";
import type { RegionId } from "../types/domain";

// TODO: Replace this with Hailey's saved location from Firebase.
const currentRegionId: RegionId = "apple-forest";

export const HomePage = () => {
  const { bedtime } = useBedtime();
  const { i18n, t } = useTranslation();
  const storyLanguage = getCurrentStoryLanguage(i18n.resolvedLanguage);
  const { stories, loading } = useStories();
  const recentStories = stories.slice(0, 4);
  const [mapFullscreen, setMapFullscreen] = useState(false);

  useEffect(() => {
    if (!mapFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMapFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mapFullscreen]);

  return (
    <section className="relative grid min-h-[calc(100vh-74px)] grid-cols-[minmax(240px,1fr)_minmax(0,2fr)] items-center gap-[clamp(24px,3vw,48px)] px-[clamp(16px,3vw,48px)] pb-[46px] pt-9 max-[880px]:grid-cols-1 max-[880px]:items-start">
      <FloatingClouds />
      <div className="relative z-[2]">
        <p className="mb-2 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
          {bedtime ? t("common.goodNight") : t("common.welcomeBack")}
        </p>
        <h1 className="mb-3 text-[clamp(44px,7vw,82px)] font-black leading-none text-fruit-parchment text-shadow-fruit">
          {t("common.appName")}
        </h1>
        <p className="text-[17px] leading-[1.7] text-fruit-muted">{t("common.heroSubtitle")}</p>
      </div>

      <KingdomMap
        bedtime={bedtime}
        currentRegionId={currentRegionId}
        fullscreen={false}
        onToggleFullscreen={() => setMapFullscreen(true)}
      />

      {mapFullscreen && (
        <div
          className="fixed inset-x-0 bottom-0 top-[74px] z-[100] bg-fruit-transparentInk/70 p-[clamp(8px,2vw,24px)] backdrop-blur-sm max-[880px]:top-[126px] max-[560px]:top-[190px]"
          role="dialog"
          aria-modal="true"
          aria-label={t("common.fullscreenMap")}
        >
          <KingdomMap
            bedtime={bedtime}
            currentRegionId={currentRegionId}
            fullscreen
            onToggleFullscreen={() => setMapFullscreen(false)}
          />
        </div>
      )}

      <div className="col-span-full">
        <div className="mb-3 flex items-end justify-between gap-4 max-[560px]:grid">
          <div>
            <p className="mb-1 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
              {t("stories.recentEyebrow")}
            </p>
            <h2 className="mb-1 text-[26px] font-black leading-[1.15] text-fruit-text">
              {t("stories.recentTitle")}
            </h2>
            <p className="text-[15px] font-bold leading-[1.6] text-fruit-muted">
              {t("stories.recentIntro")}
            </p>
          </div>
        </div>

        {loading && (
          <AnimalCard pattern="default" className="font-extrabold text-fruit-soft">
            {t("stories.loading")}
          </AnimalCard>
        )}

        {!loading && recentStories.length === 0 && (
          <AnimalCard pattern="default" className="font-extrabold text-fruit-soft">
            {t("stories.noStories")}
          </AnimalCard>
        )}

        {!loading && recentStories.length > 0 && (
          <div className="grid grid-cols-4 gap-3.5 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">
            {recentStories.map((story, index) => {
              const region = regions.find((item) => item.id === story.regionId);
              const storyText = getStoryText(story, storyLanguage);

              return (
                <Link key={story.id} to={`/regions/${story.regionId}`}>
                  <AnimalCard
                    pattern={index % 2 === 0 ? "default" : "yellow"}
                    className="grid h-full content-start gap-2"
                  >
                    <div className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
                      <span className="text-2xl">{region?.emoji ?? "📖"}</span>
                      <span>
                        {region ? t(`regions.${toTranslationKey(region.id)}.name`) : story.regionId}
                      </span>
                    </div>
                    <h3 className="line-clamp-2 text-xl font-black leading-tight text-fruit-text">
                      {storyText.title}
                    </h3>
                    <p className="line-clamp-3 text-[15px] font-bold leading-[1.55] text-fruit-muted">
                      {storyText.summary}
                    </p>
                    <span className="mt-1 inline-flex w-fit rounded-full bg-fruit-paper/65 px-2.5 py-1 text-[12px] font-black text-fruit-text">
                      {storyText.moralLesson}
                    </span>
                    <span className="mt-1 text-[13px] font-black text-fruit-primary">
                      {t("stories.reviewStory")}
                    </span>
                  </AnimalCard>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
