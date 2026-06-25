export const toTranslationKey = (id: string) =>
  id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
