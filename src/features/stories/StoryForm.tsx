import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { AnimalButton } from "../../components/AnimalButton";
import { AnimalCard } from "../../components/AnimalCard";
import type { RegionId, Story, StoryDraft, StoryLanguage, StoryText } from "../../types/domain";
import {
  emptyStoryText,
  getCurrentStoryLanguage,
  hasStoryText,
  isCompleteStoryText,
} from "./storyText";

interface StoryFormProps {
  regionId: RegionId;
  story?: Story | null;
  onSubmit: (draft: StoryDraft) => Promise<void>;
  onCancel: () => void;
}

interface BilingualStoryFormState {
  regionId: RegionId;
  originalLanguage: StoryLanguage;
  translations: Record<StoryLanguage, StoryText>;
}

const emptyDraft = (regionId: RegionId, language: StoryLanguage): BilingualStoryFormState => ({
  regionId,
  originalLanguage: language,
  translations: {
    en: emptyStoryText(),
    zh: emptyStoryText(),
  },
});

const labelClasses = "grid gap-1.5 text-[13px] font-black text-fruit-text";
const fieldClasses =
  "w-full resize-y rounded-2xl border-2 border-fruit-cardBorder bg-fruit-input px-3.5 py-3 text-fruit-text outline-none focus:border-fruit-inputFocus focus:shadow-input-focus";

export const StoryForm = ({ regionId, story, onSubmit, onCancel }: StoryFormProps) => {
  const { i18n, t } = useTranslation();
  const currentLanguage = getCurrentStoryLanguage(i18n.resolvedLanguage);
  const [draft, setDraft] = useState<BilingualStoryFormState>(
    emptyDraft(regionId, currentLanguage),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!story) {
      setDraft(emptyDraft(regionId, currentLanguage));
      return;
    }

    const legacyLanguage = story.originalLanguage ?? currentLanguage;
    const legacyText: StoryText = {
      title: story.title,
      summary: story.summary,
      content: story.content,
      moralLesson: story.moralLesson,
    };

    setDraft({
      regionId: story.regionId,
      originalLanguage: legacyLanguage,
      translations: {
        en: story.translations?.en ?? (legacyLanguage === "en" ? legacyText : emptyStoryText()),
        zh: story.translations?.zh ?? (legacyLanguage === "zh" ? legacyText : emptyStoryText()),
      },
    });
  }, [currentLanguage, regionId, story]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const primaryText = draft.translations[draft.originalLanguage];
    if (!isCompleteStoryText(primaryText)) return;

    setSaving(true);
    const translations = {
      ...(hasStoryText(draft.translations.en) ? { en: draft.translations.en } : {}),
      ...(hasStoryText(draft.translations.zh) ? { zh: draft.translations.zh } : {}),
    };
    const storyDraft: StoryDraft = {
      ...primaryText,
      regionId: draft.regionId,
      originalLanguage: draft.originalLanguage,
      translations,
    };
    await onSubmit(storyDraft);
    setSaving(false);
  };

  const updateText = (language: StoryLanguage, field: keyof StoryText, value: string) => {
    setDraft((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [language]: {
          ...current.translations[language],
          [field]: value,
        },
      },
    }));
  };

  const renderLanguageFields = (language: StoryLanguage) => {
    const text = draft.translations[language];

    return (
      <AnimalCard dashed className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-base font-black text-fruit-text">
            {language === "en" ? t("stories.englishVersion") : t("stories.chineseVersion")}
          </h4>
          <label className="inline-flex items-center gap-2 text-[12px] font-black text-fruit-soft">
            <input
              checked={draft.originalLanguage === language}
              className="accent-fruit-primary"
              name="originalLanguage"
              type="radio"
              onChange={() =>
                setDraft((current) => ({
                  ...current,
                  originalLanguage: language,
                }))
              }
            />
            {t("stories.primaryLanguage")}
          </label>
        </div>
        <label className={labelClasses}>
          {t("stories.titleLabel")}
          <input
            className={fieldClasses}
            value={text.title}
            maxLength={80}
            onChange={(event) => updateText(language, "title", event.target.value)}
          />
        </label>
        <label className={labelClasses}>
          {t("stories.summaryLabel")}
          <input
            className={fieldClasses}
            value={text.summary}
            maxLength={160}
            onChange={(event) => updateText(language, "summary", event.target.value)}
          />
        </label>
        <label className={labelClasses}>
          {t("stories.contentLabel")}
          <textarea
            className={fieldClasses}
            value={text.content}
            rows={6}
            onChange={(event) => updateText(language, "content", event.target.value)}
          />
        </label>
        <label className={labelClasses}>
          {t("stories.moralLabel")}
          <input
            className={fieldClasses}
            value={text.moralLesson}
            maxLength={120}
            onChange={(event) => updateText(language, "moralLesson", event.target.value)}
          />
        </label>
      </AnimalCard>
    );
  };

  const canSave = isCompleteStoryText(draft.translations[draft.originalLanguage]);

  return (
    <form className="grid gap-[13px]" onSubmit={handleSubmit}>
      <p className="text-[13px] font-extrabold text-fruit-soft">
        {t("stories.fillPrimaryLanguage")}
      </p>
      <div className="grid grid-cols-2 gap-3 max-[880px]:grid-cols-1">
        {renderLanguageFields("en")}
        {renderLanguageFields("zh")}
      </div>
      <div className="flex items-center justify-between gap-3.5 max-[560px]:grid max-[560px]:w-full max-[560px]:grid-cols-2">
        <AnimalButton variant="soft" onClick={onCancel}>
          {t("stories.cancel")}
        </AnimalButton>
        <AnimalButton disabled={saving || !canSave} type="submit">
          {saving ? t("stories.saving") : story ? t("stories.updateStory") : t("stories.saveStory")}
        </AnimalButton>
      </div>
    </form>
  );
};
