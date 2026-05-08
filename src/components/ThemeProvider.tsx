"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  systemTheme: ResolvedTheme;
};

type ThemeContextValue = ThemeState & {
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "theme";
const CHANGE_EVENT = "cursor-theme-change";
const SERVER_SNAPSHOT = "dark:dark";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getThemeSnapshot() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const theme = isTheme(stored) ? stored : "dark";
  const systemTheme = getSystemTheme();

  return `${theme}:${systemTheme}`;
}

function getServerThemeSnapshot() {
  return SERVER_SNAPSHOT;
}

function parseThemeSnapshot(snapshot: string): ThemeState {
  const [theme, systemTheme] = snapshot.split(":");

  return {
    theme: isTheme(theme) ? theme : "dark",
    systemTheme: systemTheme === "light" ? "light" : "dark",
  };
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  media.addEventListener("change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
    media.removeEventListener("change", callback);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const state = parseThemeSnapshot(snapshot);
  const resolvedTheme = state.theme === "system" ? state.systemTheme : state.theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...state,
      resolvedTheme,
      setTheme(theme) {
        window.localStorage.setItem(STORAGE_KEY, theme);
        window.dispatchEvent(new Event(CHANGE_EVENT));
      },
    }),
    [resolvedTheme, state],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return value;
}
