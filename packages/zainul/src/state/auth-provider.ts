import create, { StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "../configurations/titumir";
import { ContextToken } from "./AuthorizationStore";

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

export interface TokenStore {
    accessToken?: string;
    refreshToken?: string;
    get tokens(): Partial<ContextToken>;
    setTokens(tokens: Partial<ContextToken>): void;
    clearTokens(): void;
}

const tokenStore: StateCreator<TokenStore> = (set, get) => {
    const rawTokens = localStorage.getItem(AUTH_CONTEXT_LOCALSTORAGE_KEY);
    const tokens: { state?: ContextToken } = rawTokens
        ? (JSON.parse(rawTokens) as { state?: ContextToken })
        : {};
    return {
        ...tokens.state,
        get tokens() {
            const { accessToken, refreshToken } = get();
            return { accessToken, refreshToken };
        },
        setTokens(tokens) {
            set({ ...tokens });
        },
        clearTokens() {
            set({}, true);
        },
    };
};

export const AUTH_CONTEXT_LOCALSTORAGE_KEY = "authorization_dangerous_store";
export const useTokenStore = create(
    persist(tokenStore, {
        name: AUTH_CONTEXT_LOCALSTORAGE_KEY,
        whitelist: ["accessToken", "refreshToken"],
    }),
);
