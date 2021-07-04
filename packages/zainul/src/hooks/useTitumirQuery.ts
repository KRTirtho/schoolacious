import { MutationKey, useQuery, UseQueryOptions } from "react-query";
import { titumirApi } from "../App";
import Titumir, { TitumirError } from "../configurations/titumir";
import { TokenStore, useTokenStore } from "../state/auth-provider";
import { ContextToken } from "../state/AuthorizationStore";
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
            if (titumirApi.accessToken && titumirApi.refreshToken)
                setTokens({
                    accessToken: titumirApi.accessToken,
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
        if (accessToken && refreshToken && logged)
            titumirApi.setTokens({ accessToken, refreshToken });
        return hFn(titumirApi);
    }

    const logged = useLoggedIn();
    const {
        tokens: { accessToken, refreshToken },
        setTokens,
    } = useTokenStore(({ tokens, setTokens }) => ({
        tokens,
        setTokens,
    }));

    const query = useQuery<T, TitumirError>(key, queryFn, {
        ...options,
        onError(e) {
            if (e.status === 401 && accessToken && refreshToken) {
                refreshTokenOnError(titumirApi, { accessToken, refreshToken }, setTokens);
            }
            options?.onError?.(e);
        },
    });

    return query;
}

export default useTitumirQuery;
