import { titumirApi } from "App";
import { useTokenStore } from "state/token-store";

function useLogout() {
    const clearTokens = useTokenStore((s) => s.clearTokens);
    function clearAll() {
        titumirApi.logout().then(() => clearTokens());
    }
    return clearAll;
}

export default useLogout;
