import { useTranslation } from "react-i18next";

type GoogleSignInButtonProps = {
  loading: boolean;
  onClick: () => void;
};

export const GoogleSignInButton = ({ loading, onClick }: GoogleSignInButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-fruit border border-fruit-cardBorder bg-fruit-paper px-5 py-3 font-black text-fruit-text shadow-button-lift transition hover:-translate-y-0.5 hover:shadow-button-hover active:translate-y-1 active:shadow-button-press disabled:translate-y-0 disabled:opacity-60"
      type="button"
      disabled={loading}
      onClick={onClick}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-fruit-paper text-lg font-black text-fruit-blue" aria-hidden="true">G</span>
      {loading ? t("auth.login.signingIn") : t("auth.login.googleButton")}
    </button>
  );
};
