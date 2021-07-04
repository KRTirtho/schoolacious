import React, { FC, useEffect } from "react";
import { titumirApi } from "../App";
import { refreshTokenOnError } from "../hooks/useTitumirQuery";
import { useAuthStore, useTokenStore } from "./auth-provider";

export interface ContextToken {
    accessToken: string;
    refreshToken: string;
}

const AuthorizationStore: FC = ({ children }) => {
    const setUser = useAuthStore((s) => s.setUser);
    const setTokens = useTokenStore((s) => s.setTokens);
    const accessToken = useTokenStore((s) => s.accessToken);
    const refreshToken = useTokenStore((s) => s.refreshToken);
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        const tokens = { accessToken, refreshToken };
        if (accessToken && refreshToken && !user) {
            titumirApi
                .setTokens(tokens)
                .getMe()
                .then((user) => setUser(user.json))
                .catch((e) => {
                    console.error("e:", e);
                    refreshTokenOnError(
                        titumirApi,
                        { accessToken, refreshToken },
                        setTokens,
                    );
                });
        }
    }, [accessToken, refreshToken]);

    return <>{children}</>;
};

export default AuthorizationStore;
