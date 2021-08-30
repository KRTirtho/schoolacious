import { MutationKey, useQuery, UseQueryOptions } from "react-query";
import { titumirApi } from "../App";
import Titumir, { TitumirError } from "../services/api/titumir";
import { TokenStore, useTokenStore } from "../state/token-store";
import { ContextToken } from "../state/AuthorizationConfig";
import useLoggedIn from "./useLoggedIn";

export function refreshTokenOnError(
    titumirApi: Titumir,
    tokens: ContextToken,
    setTokens: TokenStore["setTokens"],
) {
    // unauthorized means the token has expired
    // refreshing the token before the retry
    titumirApi.setTokens(tokens);
    titumirApi
        .refresh()
        .then(() => {
            if (titumirApi?.refreshToken)
                setTokens({
                    refreshToken: titumirApi.refreshToken,
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
    // custom function for passing the titumir api with safe tokens
    function queryFn() {
        if (refreshToken && logged) titumirApi.setTokens({ refreshToken });
        return hFn(titumirApi);
    }

    const logged = useLoggedIn();
    const { tokens, setTokens } = useTokenStore(({ tokens, setTokens }) => ({
        tokens,
        setTokens,
    }));

    const refreshToken = tokens?.refreshToken;

    const query = useQuery<T, TitumirError>(key, queryFn, {
        ...options,
        onError(e) {
            if (e.status === 401 && refreshToken) {
                refreshTokenOnError(titumirApi, { refreshToken }, setTokens);
            }
            options?.onError?.(e);
        },
    });

    return query;
}

export default useTitumirQuery;
