import { useTitumirApiStore } from "state/titumir-store";
import { useTokenStore } from "state/token-store";

function useLogout() {
    const api = useTitumirApiStore();
    const clearTokens = useTokenStore((s) => s.clearTokens);
    function clearAll() {
        api.auth.logout().then(() => clearTokens());
    }
    return clearAll;
}

export default useLogout;
