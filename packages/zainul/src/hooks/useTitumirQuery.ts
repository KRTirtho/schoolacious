import { MutationKey, useQuery, UseQueryOptions } from "react-query";
import Titumir from "services/titumir-api/index";
import { TokenStore, useTokenStore } from "state/token-store";
import { ContextToken } from "state/AuthorizationConfig";
import { useTitumirApiStore } from "state/titumir-store";
import { TitumirError } from "services/titumir-api/TitumirError";

export function refreshTokenOnError(
    api: Titumir,
    tokens: ContextToken,
    setTokens: TokenStore["setTokens"],
) {
    // unauthorized means the token has expired
    // refreshing the token before the retry
    api.auth
        .refresh(tokens.refreshToken)
        .then(({ tokens: { refreshToken } }) => {
            if (refreshToken)
                setTokens({
                    refreshToken,
                });
        })
        .catch((e) => {
            console.error(e);
        });
}

function useTitumirQuery<T>(
    key: MutationKey,
    hFn: (titumirApi: Titumir) => Promise<T>,
    options?: UseQueryOptions<T, TitumirError>,
) {
    const api = useTitumirApiStore();
    // custom function for passing the titumir api with safe tokens
    function queryFn() {
        return hFn(api);
    }

    const refreshToken = useTokenStore((s) => s.refreshToken);
    const setTokens = useTokenStore((s) => s.setTokens);

    const query = useQuery<T, TitumirError>(key, queryFn, {
        ...options,
        onError(e) {
            if (e.status === 401 && refreshToken) {
                refreshTokenOnError(api, { refreshToken }, setTokens);
            }
            options?.onError?.(e);
        },
    });

    return query;
}

export default useTitumirQuery;
