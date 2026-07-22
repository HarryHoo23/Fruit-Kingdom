import { NavLink, Route, Routes } from "react-router-dom";
import { BedtimeBackdrop } from "./components/BedtimeBackdrop";
import { BedtimeProvider } from "./components/BedtimeProvider";
import { BedtimeToggle } from "./components/BedtimeToggle";
import { LanguageSwitcher } from "./components/LanguageSwitcher/LanguageSwitcher";
import { Shell } from "./components/Shell";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { UserMenu } from "./features/auth/components/UserMenu";
import { useBedtime } from "./hooks/useBedtime";
import { CollectionPage } from "./pages/CollectionPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegionPage } from "./pages/RegionPage";
import { useTranslation } from "react-i18next";

const ProtectedApp = () => {
  const { bedtime } = useBedtime();
  const { t } = useTranslation();

  return (
    <Shell
      bedtime={bedtime}
      nav={
        <>
          <NavLink to="/" end>
            {t("common.map")}
          </NavLink>
          <NavLink to="/collection">{t("common.stickers")}</NavLink>
        </>
      }
      action={
        <>
          <LanguageSwitcher />
          <BedtimeToggle />
          <UserMenu />
        </>
      }
    >
      <BedtimeBackdrop active={bedtime} />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="regions/:regionId" element={<RegionPage />} />
        <Route path="collection" element={<CollectionPage />} />
      </Routes>
    </Shell>
  );
};

export const App = () => (
  <BedtimeProvider>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<ProtectedApp />} />
      </Route>
    </Routes>
  </BedtimeProvider>
);
