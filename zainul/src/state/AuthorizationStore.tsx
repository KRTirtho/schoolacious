import React, { FC, useState, useEffect } from "react";
import { LocalStorageKeys } from "../configurations/enum-keys";
import { User } from "../configurations/titumir";
import authContext from "./auth-provider";

export interface ContextToken {
    accessToken: string;
    refreshToken: string;
}

const AuthorizationStore: FC = ({ children }) => {
    const [logged, setLogged] = useState(false);
    const [tokens, setTokens] = useState<ContextToken>();
    const [user, setUser] = useState<User>();

    // getting the auth tokens from localstorage & setting them for state
    useEffect(() => {
        const accessToken = localStorage.getItem(LocalStorageKeys.accessToken);
        const refreshToken = localStorage.getItem(LocalStorageKeys.refreshToken);
        if (accessToken && refreshToken) setTokens({ accessToken, refreshToken });
    }, []);

    // storing & retrieving tokens from the localstorage
    useEffect(() => {
        const isAuthenticated = tokens?.accessToken && tokens?.refreshToken;
        if (isAuthenticated) {
            localStorage.setItem(LocalStorageKeys.accessToken, tokens!.accessToken);
            localStorage.setItem(LocalStorageKeys.refreshToken, tokens!.refreshToken);
            setLogged(true);
        } else if (!isAuthenticated) {
            localStorage.removeItem(LocalStorageKeys.accessToken);
            localStorage.removeItem(LocalStorageKeys.refreshToken);
            setLogged(false);
        }
    }, [tokens]);

    return (
        <authContext.Provider
            value={{ logged, tokens, user, setLogged, setTokens, setUser }}
        >
            {children}
        </authContext.Provider>
    );
};

export default AuthorizationStore;
