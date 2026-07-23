import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { AnimalButton } from "../components/AnimalButton"
import { AnimalCard, type AnimalCardPattern } from "../components/AnimalCard"
import { characters } from "../features/characters/characterData"
import { regions } from "../features/regions/regionData"
import { StoryForm } from "../features/stories/StoryForm"
import { getCurrentStoryLanguage, getStoryText } from "../features/stories/storyText"
import { useStories } from "../hooks/useStories"
import { toTranslationKey } from "../i18n/keys"
import type { RegionId, Story, StoryDraft } from "../types/domain"
import { useKingdomProgress } from "../features/auth/hooks/useKingdomProgress"

const storyPatterns: AnimalCardPattern[] = ["pink", "yellow", "teal", "purple", "green", "orange"]

const patternForIndex = (index: number): AnimalCardPattern =>
  storyPatterns[index % storyPatterns.length]

interface StoryCardProps {
  story: Story
  storyLanguage: "en" | "zh"
  pattern: AnimalCardPattern
  onEdit: () => void
  onDelete: () => void
}

const StoryCard = ({ story, storyLanguage, pattern, onEdit, onDelete }: StoryCardProps) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const storyText = getStoryText(story, storyLanguage)

  return (
    <AnimalCard
      className="grid gap-3.5"
      pattern={pattern}>
      <div className="flex items-start justify-between gap-3.5 max-[560px]:grid">
        <div className="min-w-0">
          <h3 className="mb-1.5 text-xl font-black text-fruit-text">{storyText.title}</h3>
          <p className="my-1.5 text-sm text-fruit-soft">{storyText.summary}</p>
        </div>
        <AnimalButton
          variant="soft"
          className="shrink-0"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}>
          {expanded ? t("stories.collapse") : t("stories.expand")}
        </AnimalButton>
      </div>

      {expanded && (
        <div className="grid gap-3">
          <p className="text-[17px] leading-[1.7] text-fruit-muted">{storyText.content}</p>
          <span className="inline-flex w-fit rounded-full bg-fruit-paper/55 px-2.5 py-1 text-[13px] font-black text-fruit-text">
            {storyText.moralLesson}
          </span>
        </div>
      )}

      <div className="flex gap-2 max-[560px]:grid max-[560px]:w-full max-[560px]:grid-cols-2">
        <AnimalButton variant="soft" onClick={onEdit}>
          {t("stories.edit")}
        </AnimalButton>
        <AnimalButton variant="danger" onClick={onDelete}>
          {t("stories.delete")}
        </AnimalButton>
      </div>
    </AnimalCard>
  )
}

export const RegionPage = () => {
  const { i18n, t } = useTranslation()
  const storyLanguage = getCurrentStoryLanguage(i18n.resolvedLanguage)
  const { regionId } = useParams<{ regionId: RegionId }>()
  const region = regions.find((item) => item.id === regionId)
  const character = characters.find((item) => item.id === region?.characterId)
  const { stories, loading, error, createStory, updateStory, deleteStory } = useStories(region?.id)
  const { unlockedRegionIds, setCurrentRegion } = useKingdomProgress()
  const [formOpen, setFormOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)

  useEffect(() => {
    if (region) setCurrentRegion(region.id)
  }, [region, setCurrentRegion])

  const formTitle = useMemo(
    () => (editingStory ? t("stories.editStoryTitle") : t("stories.addStoryTitle")),
    [editingStory, t],
  )

  if (!region || !character) {
    return (
      <section className="px-[clamp(16px,4vw,48px)] pb-14 pt-8">
        <AnimalCard>
          <h1 className="mb-3 text-[clamp(44px,7vw,82px)] font-black leading-none text-fruit-parchment text-shadow-fruit">
            {t("common.regionNotFound")}
          </h1>
          <Link to="/">{t("common.returnToMap")}</Link>
        </AnimalCard>
      </section>
    )
  }

  const handleSubmit = async (draft: StoryDraft) => {
    if (editingStory) {
      await updateStory(editingStory.id, draft)
    } else {
      await createStory(draft)
    }
    setEditingStory(null)
    setFormOpen(false)
  }

  return (
    <section className="px-[clamp(16px,4vw,48px)] pb-14 pt-8">
      <Link
        className="mb-[18px] inline-flex rounded-[14px] bg-fruit-parchment/80 px-3.5 py-2 font-black text-fruit-text"
        to="/">
        {t("common.kingdomMapBack")}
      </Link>
      <div
        className={`mb-[22px] grid grid-cols-[minmax(220px,360px)_minmax(0,1fr)] items-center gap-[clamp(22px,5vw,62px)] rounded-fruit-lg border-8 border-fruit-parchment/55 ${region.theme.heroBg} p-[clamp(22px,4vw,44px)] shadow-fruit-lg max-[880px]:grid-cols-1`}>
        <div
          className={`relative grid min-h-[260px] place-items-center overflow-hidden rounded-region-blob ${region.theme.artBg} shadow-region-art`}>
          <span className="relative z-[1] animate-float-gentle text-[clamp(96px,16vw,154px)] drop-shadow-emoji">
            {region.emoji}
          </span>
          <i className="absolute right-[34px] top-6 size-[92px] rounded-full bg-fruit-parchment/30" />
          <b className="absolute bottom-[38px] left-[42px] size-[54px] rounded-full bg-fruit-parchment/30" />
        </div>
        <div>
          <p className="mb-2 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
            {unlockedRegionIds.includes(region.id) ? t("common.unlockedRegion") : t("common.comingSoon")}
          </p>
          <h1 className="mb-3 text-[clamp(44px,7vw,82px)] font-black leading-none text-fruit-parchment text-shadow-fruit">
            {t(`regions.${toTranslationKey(region.id)}.name`)}
          </h1>
          <p className="text-[17px] leading-[1.7] text-fruit-muted">
            {t(`regions.${toTranslationKey(region.id)}.description`)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(240px,360px)_minmax(0,1fr)] gap-[22px] max-[880px]:grid-cols-1">
        <AnimalCard pattern="green" className="grid content-start gap-[18px]">
          <div className="grid size-[98px] place-items-center rounded-fruit-xl bg-fruit-paper text-[54px] shadow-character-lift">
            {character.emoji}
          </div>
          <div>
            <p className="mb-2 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
              {t("common.mainCharacter")}
            </p>
            <h2 className="mb-2.5 text-[26px] font-black leading-[1.15] text-fruit-text">
              {t(`characters.${toTranslationKey(character.id)}.name`)}
            </h2>
            <strong>{t(`characters.${toTranslationKey(character.id)}.personality`)}</strong>
            <p className="text-[17px] leading-[1.7] text-fruit-muted">
              {t(`characters.${toTranslationKey(character.id)}.introduction`)}
            </p>
          </div>
        </AnimalCard>

        <AnimalCard pattern="default" className="grid gap-4">
          <div className="flex items-center justify-between gap-3.5 max-[560px]:grid max-[560px]:items-start">
            <div>
              <p className="mb-2 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
                {t("common.memoryBook")}
              </p>
              <h2 className="mb-2.5 text-[26px] font-black leading-[1.15] text-fruit-text">
                {t("stories.title")}
              </h2>
            </div>
            <AnimalButton
              onClick={() => {
                setEditingStory(null)
                setFormOpen(true)
              }}>
              {t("stories.addStory")}
            </AnimalButton>
          </div>

          {formOpen && (
            <AnimalCard dashed className="grid gap-3">
              <h3 className="mb-2 text-xl font-black text-fruit-text">{formTitle}</h3>
              <StoryForm
                regionId={region.id}
                story={editingStory}
                onCancel={() => {
                  setFormOpen(false)
                  setEditingStory(null)
                }}
                onSubmit={handleSubmit}
              />
            </AnimalCard>
          )}

          {loading && <p className="font-extrabold text-fruit-soft">{t("stories.loading")}</p>}
          {error && <p className="font-extrabold text-fruit-soft">{t(error)}</p>}
          {!loading && stories.length === 0 && (
            <p className="font-extrabold text-fruit-soft">{t("stories.noStories")}</p>
          )}

          <div className="grid gap-3">
            {stories.map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                storyLanguage={storyLanguage}
                pattern={patternForIndex(index)}
                onEdit={() => {
                  setEditingStory(story)
                  setFormOpen(true)
                }}
                onDelete={() => void deleteStory(story.id)}
              />
            ))}
          </div>
        </AnimalCard>
      </div>
    </section>
  )
}
