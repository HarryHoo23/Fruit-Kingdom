import { NavLink, Route, Routes } from "react-router-dom";
import { BedtimeBackdrop } from "./components/BedtimeBackdrop";
import { BedtimeProvider } from "./components/BedtimeProvider";
import { BedtimeToggle } from "./components/BedtimeToggle";
import { LanguageSwitcher } from "./components/LanguageSwitcher/LanguageSwitcher";
import { Shell } from "./components/Shell";
import { useBedtime } from "./hooks/useBedtime";
import { CollectionPage } from "./pages/CollectionPage";
import { HomePage } from "./pages/HomePage";
import { RegionPage } from "./pages/RegionPage";
import { useTranslation } from "react-i18next";

const AppRoutes = () => {
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
        </>
      }
    >
      <BedtimeBackdrop active={bedtime} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/regions/:regionId" element={<RegionPage />} />
        <Route path="/collection" element={<CollectionPage />} />
      </Routes>
    </Shell>
  );
};

export const App = () => (
  <BedtimeProvider>
    <AppRoutes />
  </BedtimeProvider>
);
