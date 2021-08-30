import { MutationKey, useMutation, UseMutationOptions } from "react-query";
import { titumirApi } from "../App";
import Titumir, { TitumirError } from "../services/api/titumir";
import { useTokenStore } from "../state/token-store";
import useLoggedIn from "./useLoggedIn";
import { refreshTokenOnError } from "./useTitumirQuery";

function useTitumirMutation<T, V>(
    key: MutationKey,
    hFn: (titumirApi: Titumir, payload: V) => Promise<T>,
    options?: UseMutationOptions<T, TitumirError, V>,
) {
    const logged = useLoggedIn();
    const { tokens, setTokens } = useTokenStore(({ tokens, setTokens }) => ({
        tokens,
        setTokens,
    }));

    const refreshToken = tokens?.refreshToken;

    function mutateFn(payload: V): Promise<T> {
        if (refreshToken && logged) titumirApi.setTokens({ refreshToken });
        return hFn(titumirApi, payload);
    }

    const mutation = useMutation<T, TitumirError, V>(key, mutateFn, {
        ...options,
        onError(e, v, ctx) {
            if (e.status === 401 && refreshToken)
                refreshTokenOnError(titumirApi, { refreshToken }, setTokens);
            options?.onError?.(e, v, ctx);
        },
    });

    return mutation;
}

export default useTitumirMutation;
