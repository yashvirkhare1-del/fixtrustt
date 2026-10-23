import { useSyncExternalStore } from "react";

const KEY = "ft-theme";
const listeners = new Set<() => void>();
type Theme = "light" | "dark";
let current: Theme = "light";
let initialized = false;

function init() {
  if (initialized) return;
  initialized = true;
  if (typeof window === "undefined") return;
  const stored = window.localStorage.getItem(KEY);
  if (stored === "dark" || stored === "light") {
    current = stored;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    current = "dark";
  }
  applyClass(current);
}

function applyClass(theme: Theme) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.classList.add("theme-transition");
  if (theme === "dark") el.classList.add("dark");
  else el.classList.remove("dark");
  window.setTimeout(() => el.classList.remove("theme-transition"), 400);
}

function notify() { listeners.forEach((l) => l()); }

export function getTheme(): Theme { init(); return current; }

export function setTheme(theme: Theme) {
  init();
  current = theme;
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, theme); } catch { /* ignore */ }
  }
  applyClass(theme);
  notify();
}

export function toggleTheme(): Theme {
  init();
  const next: Theme = current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

function subscribe(l: () => void) {
  init();
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, () => current, () => "light" as Theme);
}

export function initThemeScript(): string {
  return `(function(){try{var t=localStorage.getItem("${KEY}");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}}catch(e){}})()`;
}
