import { useAuthStore } from "state/authorization-store";
import { useTokenStore } from "state/token-store";

function useLoggedIn(): boolean {
    const refreshToken = useTokenStore((s) => s.refreshToken);
    const user = useAuthStore((s) => s.user);
    return user !== undefined && refreshToken !== undefined;
}

export default useLoggedIn;
