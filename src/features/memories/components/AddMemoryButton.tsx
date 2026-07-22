import { Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type AddMemoryButtonProps = {
  className?: string;
};

export const AddMemoryButton = ({ className = "" }: AddMemoryButtonProps) => {
  const { t } = useTranslation();

  return (
    <Link
      to="/memories/new"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-fruit-paper bg-fruit-paper px-5 font-black text-fruit-brown shadow-button-lift transition hover:-translate-y-px hover:shadow-button-hover active:translate-y-0.5 active:shadow-button-press focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/50 ${className}`}
    >
      <Camera size={20} strokeWidth={2.6} aria-hidden="true" />
      {t("memories.addPhoto")}
    </Link>
  );
};
