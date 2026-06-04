import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const usePanelsStore = create(
    immer((set) => ({
        notificationCenter: false,
        ownerDetails: false,

        openNotificationCenter: () =>
            set((state) => {
                state.ownerDetails = false;
                state.notificationCenter = true;
            }),

        closeNotificationCenter: () =>
            set((state) => {
                state.notificationCenter = false;
            }),

        toggleNotificationCenter: () =>
            set((state) => {
                if (state.notificationCenter) {
                    state.notificationCenter = false;
                } else {
                    state.ownerDetails = false;
                    state.notificationCenter = true;
                }
            }),

        openOwnerDetails: () =>
            set((state) => {
                state.notificationCenter = false;
                state.ownerDetails = true;
            }),

        closeOwnerDetails: () =>
            set((state) => {
                state.ownerDetails = false;
            }),

        toggleOwnerDetails: () =>
            set((state) => {
                if (state.ownerDetails) {
                    state.ownerDetails = false;
                } else {
                    state.notificationCenter = false;
                    state.ownerDetails = true;
                }
            }),

        closeAllPanels: () =>
            set((state) => {
                state.notificationCenter = false;
                state.ownerDetails = false;
            }),
    })),
);

export default usePanelsStore;
