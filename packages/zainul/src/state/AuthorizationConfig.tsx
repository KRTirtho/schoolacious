import React, { FC, useEffect, useCallback } from "react";
import { refreshTokenOnError } from "hooks/useTitumirQuery";
import { useAuthStore } from "./authorization-store";
import { useTokenStore } from "state/token-store";
import { useTitumirApiStore } from "./titumir-store";
import useLoggedIn from "hooks/useLoggedIn";

export interface ContextToken {
    refreshToken: string;
}

const AuthorizationConfig: FC = ({ children }) => {
    const setUser = useAuthStore((s) => s.setUser);
    const setTokens = useTokenStore((s) => s.setTokens);
    const refreshToken = useTokenStore((s) => s.refreshToken);
    const user = useAuthStore((s) => s.user);
    const schoolId = useAuthStore((s) => s.user?.school?.short_name);
    const gradeId = useAuthStore((s) => s.user?.ssg?.grade.standard);
    const sectionId = useAuthStore((s) => s.user?.ssg?.section.name);

    const loggedIn = useLoggedIn();

    const api = useTitumirApiStore();

    const getUser = useCallback(
        () => api.user.me().then((user) => setUser(user.json)),
        [setUser],
    );
    useEffect(() => {
        if (refreshToken && !user) {
            getUser().catch(() => {
                refreshTokenOnError(api, { refreshToken }, setTokens);
            });
        }
    }, [refreshToken, user]);

    useEffect(() => {
        if (loggedIn && !user?.school) getUser();
    }, [loggedIn, user?.school]);

    useEffect(() => {
        if (!api.schoolId && schoolId) api.setSchoolId(schoolId);
        if (!api.gradeId && gradeId) api.setGradeId(gradeId);
        if (!api.sectionId && sectionId) api.setSectionId(sectionId);
    }, [schoolId, gradeId, sectionId]);

    return <>{children}</>;
};

export default AuthorizationConfig;
