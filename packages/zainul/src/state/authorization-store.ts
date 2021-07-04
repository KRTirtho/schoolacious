import create, { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "../services/api/titumir";

export interface AuthorizationStore {
    user?: User;
    setUser(user: User): void;
}

const authStore: StateCreator<AuthorizationStore> = (set) => {
    return {
        setUser(user) {
            set({ user });
        },
    };
};

export const useAuthStore = create<AuthorizationStore>(devtools(authStore));
