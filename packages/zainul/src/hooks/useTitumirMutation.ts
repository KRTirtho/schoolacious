import { MutationKey, useMutation, UseMutationOptions } from "react-query";
import Titumir from "services/titumir-client/index";
import { TitumirError } from "services/titumir-client/TitumirError";
import { useTitumirApiStore } from "state/titumir-store";
import { useTokenStore } from "state/token-store";
import { refreshTokenOnError } from "./useTitumirQuery";

function useTitumirMutation<T, V>(
    key: MutationKey,
    hFn: (titumirApi: Titumir, payload: V) => Promise<T>,
    options?: UseMutationOptions<T, TitumirError, V>,
) {
    const api = useTitumirApiStore();
    const refreshToken = useTokenStore((s) => s.refreshToken);
    const setTokens = useTokenStore((s) => s.setTokens);

    function mutateFn(payload: V): Promise<T> {
        return hFn(api, payload);
    }

    const mutation = useMutation<T, TitumirError, V>(key, mutateFn, {
        ...options,
        onError(e, v, ctx) {
            if (e.status === 401 && refreshToken)
                refreshTokenOnError(api, { refreshToken }, setTokens);
            options?.onError?.(e, v, ctx);
        },
    });

    return mutation;
}

export default useTitumirMutation;
