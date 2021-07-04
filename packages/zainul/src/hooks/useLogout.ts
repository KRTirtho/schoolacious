import { useTokenStore } from "../state/token-store";

function useLogout() {
    const clearTokens = useTokenStore((s) => s.clearTokens);
    return clearTokens;
}

export default useLogout;
