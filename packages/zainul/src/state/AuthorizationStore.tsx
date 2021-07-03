import React, { FC, useState, useEffect } from "react";
import { titumirApi } from "../App";
import { LocalStorageKeys } from "../configurations/enum-keys";
import { User } from "../configurations/titumir";
import { refreshTokenOnError } from "../hooks/useTitumirQuery";
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
        const refreshToken = localStorage.getItem(LocalStorageKeys.refreshToken);
        const accessToken = localStorage.getItem(LocalStorageKeys.accessToken);
        if (refreshToken && accessToken) {
            setTokens({ refreshToken, accessToken });
        }
    }, []);

    useEffect(() => {
        if (logged && tokens) {
            titumirApi
                .setTokens(tokens)
                .getMe()
                .then((user) => setUser(user.json))
                .catch((e) => {
                    console.error("e:", e);
                    refreshTokenOnError(titumirApi, tokens, setTokens);
                });
        }
    }, [logged]);

    // storing & retrieving tokens from the localstorage
    useEffect(() => {
        const isAuthenticated = tokens?.accessToken && tokens?.refreshToken;
        if (isAuthenticated) {
            localStorage.setItem(LocalStorageKeys.accessToken, tokens?.accessToken ?? "");
            localStorage.setItem(
                LocalStorageKeys.refreshToken,
                tokens?.refreshToken ?? "",
            );
            setLogged(true);
        } else {
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
