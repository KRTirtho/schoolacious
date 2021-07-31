import create, { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { UserSchema } from "@veschool/types";

export interface AuthorizationStore {
    user?: UserSchema;
    setUser(user: UserSchema): void;
}

const authStore: StateCreator<AuthorizationStore> = (set) => {
    return {
        setUser(user) {
            set({ user });
        },
    };
};

export const useAuthStore = create<AuthorizationStore>(devtools(authStore));
