import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useBootStore = create(
    immer((set) => ({
        phase: "idle",

        initBoot: () =>
            set((state) => {
                try {
                    const flag = sessionStorage.getItem("boot_completed");
                    if (flag) {
                        state.phase = "done";
                    } else {
                        state.phase = "booting";
                    }
                } catch {
                    // sessionStorage unavailable (private browsing) — default to booting
                    state.phase = "booting";
                }
            }),

        markBootComplete: () =>
            set((state) => {
                state.phase = "login";
                try {
                    sessionStorage.setItem("boot_completed", "true");
                } catch {
                    // sessionStorage unavailable — silently continue
                }
            }),

        markLoginComplete: () =>
            set((state) => {
                state.phase = "done";
            }),
    })),
);

export default useBootStore;
