import create from "zustand";
import TitumirApi, { Options } from "services/titumir-client";
import { useAuthStore } from "./authorization-store";
import { USER_ROLE } from "@schoolacious/types";

export const useTitumirApiStore = create<TitumirApi>(() => {
    const user = useAuthStore.getState().user;
    const options: Options = { school: user?.school?.short_name };
    if (user?.role === USER_ROLE.student) {
        options.grade = user.ssg?.grade.standard;
        options.section = user.ssg?.section.name;
    }
    const titumirApi = new TitumirApi("http://localhost:4000", options);
    return titumirApi;
});
