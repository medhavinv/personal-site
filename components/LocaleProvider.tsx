"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  Locale,
  getContent,
  type SiteContent,
} from "@/content/site";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  content: SiteContent;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  content: getContent(DEFAULT_LOCALE),
});

const STORAGE_KEY = "vv-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "en" || saved === "th") {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.documentElement.lang = l;
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const content = useMemo(() => getContent(locale), [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, content }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const { locale, setLocale } = useContext(LocaleContext);
  return { locale, setLocale };
}

/** Returns the copy/data bundle for the active locale. */
export function useContent() {
  return useContext(LocaleContext).content;
}
