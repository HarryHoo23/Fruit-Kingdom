import { useMemo, useState, type ReactNode } from "react";
import { BedtimeContext } from "../hooks/useBedtime";

export const BedtimeProvider = ({ children }: { children: ReactNode }) => {
  const [bedtime, setBedtime] = useState(false);
  const value = useMemo(() => ({ bedtime, setBedtime }), [bedtime]);

  return <BedtimeContext.Provider value={value}>{children}</BedtimeContext.Provider>;
};
