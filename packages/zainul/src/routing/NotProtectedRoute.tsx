import useLoggedIn from "hooks/useLoggedIn";
import React, { FC } from "react";
import { Route, RouteProps } from "react-router-dom";
import NotFound404 from "./404";

interface NotProtectedRouteProps extends RouteProps {
    fallback?: React.ReactElement;
}

const NotProtectedRoute: FC<NotProtectedRouteProps> = ({
    fallback,
    children,
    ...props
}) => {
    const loggedIn = useLoggedIn();

    return <Route {...props}>{!loggedIn ? children : fallback ?? <NotFound404 />}</Route>;
};

export default NotProtectedRoute;
