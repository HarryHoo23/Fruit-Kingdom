import { useTranslation } from "react-i18next";
import { FloatingClouds } from "../../../components/FloatingClouds";

export const AuthLoadingScreen = () => {
  const { t } = useTranslation();

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-fruit-shell bg-[size:auto_auto] px-5 font-fruit">
      <FloatingClouds />
      <div className="relative z-[1] grid justify-items-center gap-4 rounded-fruit-lg border border-fruit-cardBorder bg-fruit-parchment/95 px-10 py-9 text-center shadow-fruit-lg">
        <div className="animate-float-gentle text-5xl" aria-hidden="true">
          🏰
        </div>
        <p className="font-black text-fruit-text">{t("auth.loading.checkingSession")}</p>
        <div className="h-2 w-36 overflow-hidden rounded-full bg-fruit-bananaLight">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-fruit-primary" />
        </div>
      </div>
    </main>
  );
};
