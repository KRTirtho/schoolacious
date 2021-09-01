import useLoggedIn from "hooks/useLoggedIn";
import React, { FC } from "react";
import { Route, RouteProps } from "react-router-dom";
import { USER_ROLE } from "@veschool/types";
import NotFound404 from "./404";
import { usePermissions } from "hooks/usePermissions";

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

    const isAllowed = usePermissions(roles ?? []);

    return (
        <Route {...props}>
            {(loggedIn && !roles) || (loggedIn && isAllowed)
                ? children
                : fallback ?? <NotFound404 />}
        </Route>
    );
};

export default ProtectedRoute;
