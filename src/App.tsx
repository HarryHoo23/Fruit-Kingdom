import { NavLink, Route, Routes } from "react-router-dom";
import { BedtimeBackdrop } from "./components/BedtimeBackdrop";
import { BedtimeProvider } from "./components/BedtimeProvider";
import { BedtimeToggle } from "./components/BedtimeToggle";
import { Shell } from "./components/Shell";
import { useBedtime } from "./hooks/useBedtime";
import { CollectionPage } from "./pages/CollectionPage";
import { HomePage } from "./pages/HomePage";
import { RegionPage } from "./pages/RegionPage";

const AppRoutes = () => {
  const { bedtime } = useBedtime();

  return (
    <Shell
      bedtime={bedtime}
      nav={
        <>
          <NavLink to="/" end>
            Map
          </NavLink>
          <NavLink to="/collection">Stickers</NavLink>
        </>
      }
      action={<BedtimeToggle />}
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
