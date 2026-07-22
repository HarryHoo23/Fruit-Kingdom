import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../features/auth/useAuth";

export const AccessDeniedPage = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-fruit-shell bg-[size:auto_auto] px-5 py-12 font-fruit">
      <section className="w-full max-w-lg rounded-fruit-xl border border-fruit-cardBorder bg-fruit-parchment/95 px-8 py-10 text-center shadow-fruit-lg">
        <div className="mb-4 text-6xl" aria-hidden="true">🏰</div>
        <h1 className="text-3xl font-black text-fruit-text">{t("auth.accessDenied.title")}</h1>
        <p className="mt-3 font-bold leading-relaxed text-fruit-muted">{t("auth.accessDenied.description")}</p>
        <p className="mt-5 rounded-[14px] bg-fruit-cream px-4 py-3 text-sm font-extrabold text-fruit-soft">
          {t("auth.accessDenied.signedInAs", { email: user?.email ?? "" })}
        </p>
        <button className="mt-6 rounded-fruit bg-fruit-danger px-6 py-3 font-black text-fruit-paper shadow-danger-lift active:translate-y-1 active:shadow-danger-press disabled:opacity-60" type="button" disabled={loading} onClick={() => void handleSignOut()}>
          {t("auth.accessDenied.signOut")}
        </button>
      </section>
    </main>
  );
};
