import { useContext } from "react";
import { LocalStorageKeys } from "../configurations/enum-keys";
import authContext, { AuthorizationContext } from "../state/auth-provider";

function useAuthorization(): AuthorizationContext & { logout: VoidFunction } {
    const ctx = useContext(authContext);

    function logout() {
        ctx.setTokens(undefined);
        localStorage.removeItem(LocalStorageKeys.accessToken);
        localStorage.removeItem(LocalStorageKeys.refreshToken);
    }

    return { logout, ...ctx };
}

export default useAuthorization;
