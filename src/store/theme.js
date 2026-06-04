import { create } from "zustand";

const useThemeStore = create((set) => ({
    dark: false,

    toggle: () =>
        set((state) => {
            const next = !state.dark;
            // Apply class to document root
            if (next) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            // Persist to localStorage
            try {
                localStorage.setItem("theme", next ? "dark" : "light");
            } catch {}
            return { dark: next };
        }),

    init: () => {
        try {
            const saved = localStorage.getItem("theme");
            if (saved === "dark") {
                document.documentElement.classList.add("dark");
                set({ dark: true });
                return;
            }
            if (saved === "light") {
                document.documentElement.classList.remove("dark");
                set({ dark: false });
                return;
            }
            // No preference saved — check system preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark");
                set({ dark: true });
            }
        } catch {}
    },
}));

export default useThemeStore;
