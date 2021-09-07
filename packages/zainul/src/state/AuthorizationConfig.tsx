import React, { FC, useEffect } from "react";
import { titumirApi } from "../App";
import { refreshTokenOnError } from "../hooks/useTitumirQuery";
import { useAuthStore } from "./authorization-store";
import { useTokenStore } from "../state/token-store";

export interface ContextToken {
    refreshToken: string;
}

const AuthorizationConfig: FC = ({ children }) => {
    const setUser = useAuthStore((s) => s.setUser);
    const setTokens = useTokenStore((s) => s.setTokens);
    const refreshToken = useTokenStore((s) => s.refreshToken);
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        if (refreshToken && !user) {
            titumirApi
                .getMe()
                .then((user) => setUser(user.json))
                .catch(() => {
                    refreshTokenOnError(titumirApi, { refreshToken }, setTokens);
                });
        }
    }, [refreshToken]);

    return <>{children}</>;
};

export default AuthorizationConfig;
