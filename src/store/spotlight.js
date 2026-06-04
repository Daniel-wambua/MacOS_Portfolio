import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useSpotlightStore = create(
    immer((set) => ({
        isOpen: false,
        query: "",
        highlightedIndex: 0,

        openSpotlight: () =>
            set((state) => {
                state.isOpen = true;
                state.query = "";
                state.highlightedIndex = 0;
            }),

        closeSpotlight: () =>
            set((state) => {
                state.isOpen = false;
            }),

        toggleSpotlight: () =>
            set((state) => {
                state.isOpen = !state.isOpen;
                if (state.isOpen) {
                    state.query = "";
                    state.highlightedIndex = 0;
                }
            }),

        setQuery: (text) =>
            set((state) => {
                state.query = text;
                state.highlightedIndex = 0;
            }),

        setHighlightedIndex: (idx) =>
            set((state) => {
                state.highlightedIndex = idx;
            }),
    })),
);

export default useSpotlightStore;
