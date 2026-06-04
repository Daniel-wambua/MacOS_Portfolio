import { create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {locations} from "#constants";

const DEFAULT_LOCATION = locations.work;

const useLocationStore = create(immer((set) => ({
    activeLocation: DEFAULT_LOCATION,

    setActiveLocation: (location) =>
        set((state) => {
            if (!location || typeof location !== 'object' || Object.keys(location).length === 0) return;
            state.activeLocation = location;
    }),

    resetActiveLocation: () =>
        set((state) =>{
            state.activeLocation = DEFAULT_LOCATION
        }),
})));


export default useLocationStore;