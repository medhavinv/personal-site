"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEFAULT_PALETTE, PaletteName } from "@/content/site";

type ThemeContextValue = {
  palette: PaletteName;
  setPalette: (p: PaletteName) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  palette: DEFAULT_PALETTE,
  setPalette: () => {},
});

const STORAGE_KEY = "vv-palette";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteName>(DEFAULT_PALETTE);

  // Restore a previously chosen palette on mount.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as PaletteName | null;
    if (saved) {
      setPaletteState(saved);
      document.documentElement.setAttribute("data-palette", saved);
    }
  }, []);

  const setPalette = useCallback((p: PaletteName) => {
    setPaletteState(p);
    document.documentElement.setAttribute("data-palette", p);
    window.localStorage.setItem(STORAGE_KEY, p);
  }, []);

  return (
    <ThemeContext.Provider value={{ palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
