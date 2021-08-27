import create, { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { AUTH_CONTEXT_LOCALSTORAGE_KEY } from "../configs/constants";
import { ContextToken } from "./AuthorizationConfig";

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
            return get();
        },
        setTokens(tokens) {
            set({ ...tokens });
        },
        clearTokens() {
            set({}, true);
        },
    };
};

export const useTokenStore = create(
    persist(tokenStore, {
        name: AUTH_CONTEXT_LOCALSTORAGE_KEY,
        whitelist: ["accessToken", "refreshToken"],
    }),
);
