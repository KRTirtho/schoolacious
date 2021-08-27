import useLoggedIn from "hooks/useLoggedIn";
import React, { FC } from "react";
import { Route, RouteProps } from "react-router-dom";
import { useAuthStore } from "state/authorization-store";
import { USER_ROLE } from "@veschool/types";
import NotFound404 from "./404";

interface ProtectedRouteProps extends RouteProps {
    roles?: USER_ROLE[];
    fallback?: React.ReactElement;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
    roles,
    fallback,
    children,
    ...props
}) => {
    const loggedIn = useLoggedIn();
    const user = useAuthStore((s) => s.user);

    return (
        <Route {...props}>
            {(loggedIn && !roles) ||
            (loggedIn && roles && roles?.includes(user?.role ?? ("" as USER_ROLE)))
                ? children
                : fallback ?? <NotFound404 />}
        </Route>
    );
};

export default ProtectedRoute;
