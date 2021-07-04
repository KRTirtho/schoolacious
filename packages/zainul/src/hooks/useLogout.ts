import { useTokenStore } from "../state/auth-provider";

function useLogout() {
    const clearTokens = useTokenStore((s) => s.clearTokens);
    return clearTokens;
}

export default useLogout;
