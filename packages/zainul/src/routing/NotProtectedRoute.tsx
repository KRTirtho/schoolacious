import useLoggedIn from "hooks/useLoggedIn";
import React, { FC } from "react";
import NotFound404 from "./404";

interface NotProtectedRouteProps {
    fallback?: React.ReactElement;
}

const NotProtectedRoute: FC<NotProtectedRouteProps> = ({
    fallback = <NotFound404 />,
    children,
}) => {
    const loggedIn = useLoggedIn();

    if (!loggedIn) {
        return <>{children}</>;
    }
    return <>{fallback}</>;
};

export default NotProtectedRoute;
