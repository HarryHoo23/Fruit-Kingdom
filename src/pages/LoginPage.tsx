import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import haileyAvatar from "../assets/img/hailey-avatar.webp";
import { FloatingClouds } from "../components/FloatingClouds";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import { AuthLoadingScreen } from "../features/auth/components/AuthLoadingScreen";
import { GoogleSignInButton } from "../features/auth/components/GoogleSignInButton";
import { FriendlyAuthError, type AuthErrorKind } from "../features/auth/services/authService";
import { useAuth } from "../features/auth/useAuth";

type LoginLocationState = { from?: { pathname: string; search?: string; hash?: string } };

const errorKeys: Record<AuthErrorKind, string> = {
  popupClosed: "auth.login.errorPopupClosed",
  popupBlocked: "auth.login.errorPopupBlocked",
  unauthorizedDomain: "auth.login.errorUnauthorizedDomain",
  network: "auth.login.errorNetwork",
  generic: "auth.login.errorGeneric",
};

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAuthLoading, isProfileLoading, signIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const state = location.state as LoginLocationState | null;

  useEffect(() => {
    if (!user || !profile?.active || isProfileLoading) return;
    const destination = state?.from
      ? `${state.from.pathname}${state.from.search ?? ""}${state.from.hash ?? ""}`
      : "/";
    navigate(destination, { replace: true });
  }, [user, profile, isProfileLoading, navigate, state]);

  if (isAuthLoading || (user && isProfileLoading)) return <AuthLoadingScreen />;
  if (user && !profile?.active) return <Navigate to="/" replace />;

  const handleSignIn = async () => {
    setSigningIn(true);
    setErrorKey(null);
    try {
      await signIn();
    } catch (error) {
      const kind = error instanceof FriendlyAuthError ? error.kind : "generic";
      setErrorKey(errorKeys[kind]);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-fruit-shell bg-[size:auto_auto] px-5 py-12 font-fruit">
      <FloatingClouds />
      <div className="absolute right-5 top-5 z-10">
        <LanguageSwitcher />
      </div>
      <section className="relative z-[1] w-full max-w-lg rounded-fruit-xl border border-fruit-cardBorder bg-fruit-parchment/95 px-[clamp(24px,6vw,52px)] py-10 text-center shadow-fruit-lg backdrop-blur-sm">
        <span className="absolute -left-4 top-16 animate-float-gentle text-4xl" aria-hidden="true">
          🍃
        </span>
        <span
          className="absolute -right-3 bottom-20 animate-float-gentle text-4xl"
          aria-hidden="true"
        >
          🌼
        </span>
        <img
          className="mx-auto mb-5 h-24 w-24 animate-hailey-float rounded-full border-4 border-fruit-paper object-cover shadow-hailey-glow"
          src={haileyAvatar}
          alt=""
        />
        <p className="mb-2 text-sm font-black uppercase tracking-[0.08em] text-fruit-primary">
          {t("auth.login.welcome")}
        </p>
        <h1 className="text-[clamp(30px,7vw,44px)] font-black leading-tight text-fruit-text">
          {t("auth.login.title")}
        </h1>
        <p className="mx-auto mb-7 mt-4 max-w-md font-bold leading-relaxed text-fruit-muted">
          {t("auth.login.subtitle")}
        </p>
        <GoogleSignInButton loading={signingIn} onClick={() => void handleSignIn()} />
        {errorKey && (
          <p
            className="mt-4 rounded-[14px] bg-fruit-appleLight px-4 py-3 text-sm font-extrabold text-fruit-danger"
            role="alert"
          >
            {t(errorKey)}
          </p>
        )}
        <p className="mt-5 text-sm font-bold text-fruit-soft">🔐 {t("auth.login.familyOnly")}</p>
      </section>
    </main>
  );
};
