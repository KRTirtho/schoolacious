import { useContext } from "react";
import authContext, { AuthorizationContext } from "../state/auth-provider";

function useAuthorization(): AuthorizationContext & { logout: VoidFunction } {
    const ctx = useContext(authContext);

    function logout() {
        ctx.setTokens(undefined);
    }

    return { logout, ...ctx };
}

export default useAuthorization;
