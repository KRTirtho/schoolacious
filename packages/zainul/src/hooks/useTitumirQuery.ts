import { useQuery, UseQueryOptions } from "react-query";
import { titumirApi } from "../App";
import Titumir, { TitumirError } from "../configurations/titumir";
import { AuthorizationContext } from "../state/auth-provider";
import { ContextToken } from "../state/AuthorizationStore";
import useAuthorization from "./useAuthorization";

export function refreshTokenOnError(
    titumirApi: Titumir,
    tokens: ContextToken,
    setUser: AuthorizationContext["setUser"],
    setTokens: AuthorizationContext["setTokens"],
) {
    // unauthorized means the token has expired
    // refreshing the token before the retry
    titumirApi.setTokens(tokens);
    titumirApi
        .refresh()
        .then(({ json: { user } }) => {
            if (titumirApi.accessToken && titumirApi.refreshToken)
                setTokens({
                    accessToken: titumirApi.accessToken,
                    refreshToken: titumirApi.refreshToken,
                });
            setUser(user);
        })
        .catch((e) => {
            console.error(e);
        });
}

function useTitumirQuery<T>(
    key: string,
    hFn: (titumirApi: Titumir) => Promise<T>,
    options: UseQueryOptions<T, TitumirError>,
) {
    // custom function for passing the titumir api with safe tokens
    function queryFn() {
        if (tokens && logged) titumirApi.setTokens(tokens);
        return hFn(titumirApi);
    }

    const { tokens, logged, setTokens, setUser } = useAuthorization();

    const query = useQuery<T, TitumirError>(key, queryFn, {
        ...options,
        onError(e) {
            if (e.status === 401 && tokens) {
                refreshTokenOnError(titumirApi, tokens, setUser, setTokens);
            }
            options.onError?.(e);
        },
    });

    return query;
}

export default useTitumirQuery;
