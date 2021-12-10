import useLoggedIn from "hooks/useLoggedIn";
import React, { FC } from "react";
import { USER_ROLE } from "@veschool/types";
import NotFound404 from "./404";
import { usePermissions } from "hooks/usePermissions";

interface ProtectedRouteProps {
    roles?: USER_ROLE[];
    fallback?: React.ReactElement;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
    roles,
    fallback = <NotFound404 />,
    children,
}) => {
    const loggedIn = useLoggedIn();

    const isAllowed = usePermissions(roles ?? []);

    if ((loggedIn && !roles) || (loggedIn && isAllowed)) {
        return <>{children}</>;
    }
    return <>{fallback}</>;
};

export default ProtectedRoute;
