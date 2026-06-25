import { createContext, useContext } from "react";

export interface BedtimeContextValue {
  bedtime: boolean;
  setBedtime: (value: boolean) => void;
}

export const BedtimeContext = createContext<BedtimeContextValue | undefined>(undefined);

export const useBedtime = () => {
  const context = useContext(BedtimeContext);
  if (!context) {
    throw new Error("useBedtime must be used within BedtimeProvider");
  }
  return context;
};
