export const childProfile = {
  name: "Hailey",
  birthDate: "2024-09-19",
} as const;

const parseCalendarDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
};

export const calculateAgeInMonths = (capturedAt: Date) => {
  const birth = parseCalendarDate(childProfile.birthDate);
  let months =
    (capturedAt.getFullYear() - birth.year) * 12 + (capturedAt.getMonth() + 1 - birth.month);

  if (capturedAt.getDate() < birth.day) months -= 1;
  return Math.max(0, months);
};

export const formatAge = (ageInMonths: number, language: string) => {
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;

  if (language.startsWith("zh")) {
    if (years === 0) return `${months} 个月`;
    if (months === 0) return `${years} 岁`;
    return `${years} 岁 ${months} 个月`;
  }

  const yearLabel = years === 1 ? "year" : "years";
  const monthLabel = months === 1 ? "month" : "months";
  if (years === 0) return `${months} ${monthLabel}`;
  if (months === 0) return `${years} ${yearLabel}`;
  return `${years} ${yearLabel} ${months} ${monthLabel}`;
};
