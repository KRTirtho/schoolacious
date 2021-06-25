import { useQuery, UseQueryOptions } from "react-query";
import { titumirApi } from "../App";
import Titumir, { TitumirError } from "../configurations/titumir";
import useAuthorization from "./useAuthorization";

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
            // unauthorized means the token has expired
            // refreshing the token before the retry
            if (e.status === 401 && tokens) {
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
            options.onError?.(e);
        },
    });

    return query;
}

export default useTitumirQuery;
