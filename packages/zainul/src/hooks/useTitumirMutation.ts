import { useMutation, UseMutationOptions } from "react-query";
import { titumirApi } from "../App";
import Titumir, { TitumirError } from "../configurations/titumir";
import useAuthorization from "./useAuthorization";
import { refreshTokenOnError } from "./useTitumirQuery";

function useTitumirMutation<T, V>(
    key: string,
    hFn: (titumirApi: Titumir, payload: V) => Promise<T>,
    options?: UseMutationOptions<T, TitumirError, V>,
) {
    const { tokens, logged, setUser, setTokens } = useAuthorization();

    function mutateFn(payload: V): Promise<T> {
        if (tokens && logged) titumirApi.setTokens(tokens);
        return hFn(titumirApi, payload);
    }

    const mutation = useMutation<T, TitumirError, V>(key, mutateFn, {
        ...options,
        onError(e, v, ctx) {
            if (e.status === 401 && tokens)
                refreshTokenOnError(titumirApi, tokens, setUser, setTokens);
            options?.onError?.(e, v, ctx);
        },
    });

    return mutation;
}

export default useTitumirMutation;
