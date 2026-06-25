import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimalButton } from "../components/AnimalButton";
import { AnimalCard, type AnimalCardPattern } from "../components/AnimalCard";
import { characters } from "../features/characters/characterData";
import { regions } from "../features/regions/regionData";
import { StoryForm } from "../features/stories/StoryForm";
import { useStories } from "../hooks/useStories";
import type { RegionId, Story, StoryDraft } from "../types/domain";

const storyPatterns: AnimalCardPattern[] = ["pink", "yellow", "teal", "purple", "green", "orange"];

const patternForIndex = (index: number): AnimalCardPattern =>
  storyPatterns[index % storyPatterns.length];

export const RegionPage = () => {
  const { regionId } = useParams<{ regionId: RegionId }>();
  const region = regions.find((item) => item.id === regionId);
  const character = characters.find((item) => item.id === region?.characterId);
  const { stories, loading, error, createStory, updateStory, deleteStory } = useStories(region?.id);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  const formTitle = useMemo(
    () => (editingStory ? "Edit bedtime story" : "Add a bedtime story"),
    [editingStory],
  );

  if (!region || !character) {
    return (
      <section className="px-[clamp(16px,4vw,48px)] pb-14 pt-8">
        <AnimalCard>
          <h1 className="mb-3 text-[clamp(44px,7vw,82px)] font-black leading-none text-fruit-parchment text-shadow-fruit">
            Region not found
          </h1>
          <Link to="/">Return to the kingdom map</Link>
        </AnimalCard>
      </section>
    );
  }

  const handleSubmit = async (draft: StoryDraft) => {
    if (editingStory) {
      await updateStory(editingStory.id, draft);
    } else {
      await createStory(draft);
    }
    setEditingStory(null);
    setFormOpen(false);
  };

  return (
    <section className="px-[clamp(16px,4vw,48px)] pb-14 pt-8">
      <Link
        className="mb-[18px] inline-flex rounded-[14px] bg-fruit-parchment/80 px-3.5 py-2 font-black text-fruit-text"
        to="/"
      >
        ← Kingdom map
      </Link>
      <div
        className={`mb-[22px] grid grid-cols-[minmax(220px,360px)_minmax(0,1fr)] items-center gap-[clamp(22px,5vw,62px)] rounded-fruit-lg border-8 border-fruit-parchment/55 ${region.theme.heroBg} p-[clamp(22px,4vw,44px)] shadow-fruit-lg max-[880px]:grid-cols-1`}
      >
        <div
          className={`relative grid min-h-[260px] place-items-center overflow-hidden rounded-region-blob ${region.theme.artBg} shadow-region-art`}
        >
          <span className="relative z-[1] animate-float-gentle text-[clamp(96px,16vw,154px)] drop-shadow-emoji">
            {region.emoji}
          </span>
          <i className="absolute right-[34px] top-6 size-[92px] rounded-full bg-fruit-parchment/30" />
          <b className="absolute bottom-[38px] left-[42px] size-[54px] rounded-full bg-fruit-parchment/30" />
        </div>
        <div>
          <p className="mb-2 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
            {region.unlocked ? "Unlocked region" : "Coming soon"}
          </p>
          <h1 className="mb-3 text-[clamp(44px,7vw,82px)] font-black leading-none text-fruit-parchment text-shadow-fruit">
            {region.name}
          </h1>
          <p className="text-[17px] leading-[1.7] text-fruit-muted">{region.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(240px,360px)_minmax(0,1fr)] gap-[22px] max-[880px]:grid-cols-1">
        <AnimalCard pattern="green" className="grid content-start gap-[18px]">
          <div className="grid size-[98px] place-items-center rounded-fruit-xl bg-fruit-paper text-[54px] shadow-character-lift">
            {character.emoji}
          </div>
          <div>
            <p className="mb-2 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
              Main character
            </p>
            <h2 className="mb-2.5 text-[26px] font-black leading-[1.15] text-fruit-text">
              {character.name}
            </h2>
            <strong>{character.personality}</strong>
            <p className="text-[17px] leading-[1.7] text-fruit-muted">{character.introduction}</p>
          </div>
        </AnimalCard>

        <AnimalCard pattern="default" className="grid gap-4">
          <div className="flex items-center justify-between gap-3.5 max-[560px]:grid max-[560px]:items-start">
            <div>
              <p className="mb-2 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
                Memory book
              </p>
              <h2 className="mb-2.5 text-[26px] font-black leading-[1.15] text-fruit-text">
                Stories
              </h2>
            </div>
            <AnimalButton
              onClick={() => {
                setEditingStory(null);
                setFormOpen(true);
              }}
            >
              + Add Story
            </AnimalButton>
          </div>

          {formOpen && (
            <AnimalCard dashed className="grid gap-3">
              <h3 className="mb-2 text-xl font-black text-fruit-text">{formTitle}</h3>
              <StoryForm
                regionId={region.id}
                story={editingStory}
                onCancel={() => {
                  setFormOpen(false);
                  setEditingStory(null);
                }}
                onSubmit={handleSubmit}
              />
            </AnimalCard>
          )}

          {loading && <p className="font-extrabold text-fruit-soft">Loading stories...</p>}
          {error && <p className="font-extrabold text-fruit-soft">{error}</p>}
          {!loading && stories.length === 0 && (
            <p className="font-extrabold text-fruit-soft">No stories here yet.</p>
          )}

          <div className="grid gap-3">
            {stories.map((story, index) => (
              <AnimalCard
                className="flex items-start justify-between gap-3.5 max-[560px]:grid max-[560px]:items-start"
                key={story.id}
                pattern={patternForIndex(index)}
              >
                <div>
                  <h3 className="mb-1.5 text-xl font-black text-fruit-text">{story.title}</h3>
                  <p className="text-[17px] leading-[1.7] text-fruit-muted">{story.summary}</p>
                  <span className="mt-2 inline-flex rounded-full bg-fruit-paper/55 px-2.5 py-1 text-[13px] font-black text-fruit-text">
                    {story.moralLesson}
                  </span>
                </div>
                <div className="flex gap-2 max-[560px]:grid max-[560px]:w-full max-[560px]:grid-cols-2">
                  <AnimalButton
                    variant="soft"
                    onClick={() => {
                      setEditingStory(story);
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </AnimalButton>
                  <AnimalButton variant="danger" onClick={() => void deleteStory(story.id)}>
                    Delete
                  </AnimalButton>
                </div>
              </AnimalCard>
            ))}
          </div>
        </AnimalCard>
      </div>
    </section>
  );
};
