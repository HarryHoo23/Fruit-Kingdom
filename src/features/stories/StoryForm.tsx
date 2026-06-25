import { useEffect, useState, type FormEvent } from "react";
import { AnimalButton } from "../../components/AnimalButton";
import type { RegionId, Story, StoryDraft } from "../../types/domain";

interface StoryFormProps {
  regionId: RegionId;
  story?: Story | null;
  onSubmit: (draft: StoryDraft) => Promise<void>;
  onCancel: () => void;
}

const emptyDraft = (regionId: RegionId): StoryDraft => ({
  regionId,
  title: "",
  summary: "",
  content: "",
  moralLesson: "",
});

const labelClasses = "grid gap-1.5 text-[13px] font-black text-fruit-text";
const fieldClasses =
  "w-full resize-y rounded-2xl border-2 border-fruit-cardBorder bg-fruit-input px-3.5 py-3 text-fruit-text outline-none focus:border-fruit-inputFocus focus:shadow-input-focus";

export const StoryForm = ({ regionId, story, onSubmit, onCancel }: StoryFormProps) => {
  const [draft, setDraft] = useState<StoryDraft>(emptyDraft(regionId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(
      story
        ? {
            title: story.title,
            regionId: story.regionId,
            summary: story.summary,
            content: story.content,
            moralLesson: story.moralLesson,
          }
        : emptyDraft(regionId),
    );
  }, [regionId, story]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    await onSubmit(draft);
    setSaving(false);
  };

  return (
    <form className="grid gap-[13px]" onSubmit={handleSubmit}>
      <label className={labelClasses}>
        Story title
        <input
          className={fieldClasses}
          value={draft.title}
          required
          maxLength={80}
          onChange={(event) => setDraft({ ...draft, title: event.target.value })}
        />
      </label>
      <label className={labelClasses}>
        Tiny summary
        <input
          className={fieldClasses}
          value={draft.summary}
          required
          maxLength={160}
          onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
        />
      </label>
      <label className={labelClasses}>
        Bedtime story
        <textarea
          className={fieldClasses}
          value={draft.content}
          required
          rows={7}
          onChange={(event) => setDraft({ ...draft, content: event.target.value })}
        />
      </label>
      <label className={labelClasses}>
        Moral lesson
        <input
          className={fieldClasses}
          value={draft.moralLesson}
          required
          maxLength={120}
          onChange={(event) => setDraft({ ...draft, moralLesson: event.target.value })}
        />
      </label>
      <div className="flex items-center justify-between gap-3.5 max-[560px]:grid max-[560px]:w-full max-[560px]:grid-cols-2">
        <AnimalButton variant="soft" onClick={onCancel}>
          Cancel
        </AnimalButton>
        <AnimalButton disabled={saving}>
          {saving ? "Saving..." : story ? "Update Story" : "Save Story"}
        </AnimalButton>
      </div>
    </form>
  );
};
