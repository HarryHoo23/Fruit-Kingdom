import { useTranslation } from "react-i18next";
import { supportedLanguages, type AppLanguage } from "../../i18n";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage: AppLanguage = i18n.resolvedLanguage === "zh" ? "zh" : "en";

  const handleLanguageChange = (language: AppLanguage) => {
    void i18n.changeLanguage(language);
  };

  return (
    <div
      className="inline-flex h-[42px] items-center gap-1 rounded-full border-[2.5px] border-fruit-switchBorder bg-fruit-paper p-1 shadow-switch-inner max-[560px]:w-full"
      aria-label={t("common.language")}
      role="group"
    >
      <span className="px-1.5 text-lg" aria-hidden="true">
        🌏
      </span>
      {supportedLanguages.map((language) => (
        <button
          className={[
            "h-8 rounded-full px-3 text-sm font-black transition",
            currentLanguage === language
              ? "bg-fruit-sky text-fruit-paper shadow-fruit-sm"
              : "text-fruit-soft hover:bg-fruit-cream hover:text-fruit-text",
          ].join(" ")}
          key={language}
          type="button"
          onClick={() => handleLanguageChange(language)}
          aria-pressed={currentLanguage === language}
        >
          {language === "en" ? t("common.english") : t("common.chinese")}
        </button>
      ))}
    </div>
  );
};
