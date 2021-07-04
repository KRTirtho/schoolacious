import { useAuthStore, useTokenStore } from "../state/auth-provider";

function useLoggedIn(): boolean {
    const accessToken = useTokenStore((s) => s.accessToken);
    const refreshToken = useTokenStore((s) => s.refreshToken);
    const user = useAuthStore((s) => s.user);
    return user !== undefined && accessToken !== undefined && refreshToken !== undefined;
}

export default useLoggedIn;
