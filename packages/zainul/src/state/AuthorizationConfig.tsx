import React, { FC, useEffect } from "react";
import { refreshTokenOnError } from "hooks/useTitumirQuery";
import { useAuthStore } from "./authorization-store";
import { useTokenStore } from "state/token-store";
import { useTitumirApiStore } from "./titumir-store";

export interface ContextToken {
    refreshToken: string;
}

const AuthorizationConfig: FC = ({ children }) => {
    const setUser = useAuthStore((s) => s.setUser);
    const setTokens = useTokenStore((s) => s.setTokens);
    const refreshToken = useTokenStore((s) => s.refreshToken);
    const user = useAuthStore((s) => s.user);
    const schoolId = useAuthStore((s) => s.user?.school?.short_name);

    const api = useTitumirApiStore();

    useEffect(() => {
        if (refreshToken && !user) {
            api.user
                .me()
                .then((user) => setUser(user.json))
                .catch(() => {
                    refreshTokenOnError(api, { refreshToken }, setTokens);
                });
        }
    }, [refreshToken]);

    useEffect(() => {
        if (schoolId) api.setSchoolId(schoolId);
    }, [schoolId]);

    return <>{children}</>;
};

export default AuthorizationConfig;
