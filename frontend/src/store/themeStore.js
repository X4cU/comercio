import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('comercio-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  document.body.dataset.theme = theme;
  window.localStorage.setItem('comercio-theme', theme);
};

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create((set) => ({
  theme: initialTheme,
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      return { theme: nextTheme };
    }),
  setTheme: (theme) => {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    applyTheme(normalized);
    set({ theme: normalized });
  }
}));
