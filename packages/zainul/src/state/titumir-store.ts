import create from "zustand";
import TitumirApi from "services/titumir-client";
import { useAuthStore } from "./authorization-store";

export const useTitumirApiStore = create<TitumirApi>(() => {
    const school = useAuthStore.getState().user?.school?.short_name;
    const titumirApi = new TitumirApi("http://localhost:4000", { school });
    return titumirApi;
});
