import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { WINDOW_CONFIG, INITIAL_Z_INDEX } from "#constants/index.js";

const useWindowStore = create(
    immer((set, get) => ({
        windows: structuredClone ? structuredClone(WINDOW_CONFIG) : JSON.parse(JSON.stringify(WINDOW_CONFIG)),
        nextZIndex: INITIAL_Z_INDEX + 1,

        openWindow: (windowKey, data = null) =>
            set((state) => {
                console.log('[openWindow]', windowKey, data);
                const win = state.windows[windowKey];
                win.isOpen = true;
                win.zIndex = state.nextZIndex;
                win.data = data ?? win.data;
                state.nextZIndex++;
            }),

        closeWindow: (windowKey, data = null) =>
            set((state) => {
                const win = state.windows[windowKey];
                win.isOpen = false;
                win.zIndex = INITIAL_Z_INDEX;
                win.data = null;
                win.lastPosition = null;
                win.lastSize = null;
            }),

        focusWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.zIndex = state.nextZIndex++;
            }),

        minimizeWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isMinimized = true;
                win.isOpen = false;
                win.zIndex = INITIAL_Z_INDEX;
                // lastPosition and lastSize are preserved as-is
                // (they are set by the UI layer before calling minimize)
            }),

        restoreWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isMinimized = false;
                win.isOpen = true;
                win.zIndex = state.nextZIndex++;
            }),

        setWindowLayout: (windowKey, { position, size }) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                if (position !== undefined) win.lastPosition = position;
                if (size !== undefined) win.lastSize = size;
            }),

        getActiveWindow: () => {
            const { windows } = get();
            let activeKey = null;
            let highestZ = -Infinity;

            for (const [key, win] of Object.entries(windows)) {
                if (win.isOpen && !win.isMinimized && win.zIndex > highestZ) {
                    highestZ = win.zIndex;
                    activeKey = key;
                }
            }

            return activeKey;
        },
    })),
);
export default useWindowStore;