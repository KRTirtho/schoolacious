import { QueryFunction, useQueries, UseQueryOptions } from "react-query";
import Titumir from "services/titumir-client";
import { TitumirError } from "services/titumir-client/TitumirError";
import { useTitumirApiStore } from "state/titumir-store";
import { useTokenStore } from "state/token-store";
import { refreshTokenOnError } from "./useTitumirQuery";

declare type MAXIMUM_DEPTH = 20;
declare type GetOptions<T extends any> = T extends {
    queryFnData: infer TQueryFnData;
    error?: infer TError;
    data: infer TData;
}
    ? UseQueryOptions<TQueryFnData, TError, TData>
    : T extends {
          queryFnData: infer TQueryFnData;
          error?: infer TError;
      }
    ? UseQueryOptions<TQueryFnData, TError>
    : T extends {
          data: infer TData;
          error?: infer TError;
      }
    ? UseQueryOptions<unknown, TError, TData>
    : T extends [infer TQueryFnData, infer TError, infer TData]
    ? UseQueryOptions<TQueryFnData, TError, TData>
    : T extends [infer TQueryFnData, infer TError]
    ? UseQueryOptions<TQueryFnData, TError>
    : T extends [infer TQueryFnData]
    ? UseQueryOptions<TQueryFnData>
    : T extends {
          queryFn?: QueryFunction<infer TQueryFnData>;
          select: (data: any) => infer TData;
      }
    ? UseQueryOptions<TQueryFnData, unknown, TData>
    : T extends {
          queryFn?: QueryFunction<infer TQueryFnData>;
      }
    ? UseQueryOptions<TQueryFnData>
    : UseQueryOptions;

export declare type QueriesOptions<
    T extends any[],
    Result extends any[] = [],
    Depth extends ReadonlyArray<number> = [],
> = Depth["length"] extends MAXIMUM_DEPTH
    ? UseQueryOptions[]
    : T extends []
    ? []
    : T extends [infer Head]
    ? [...Result, GetOptions<Head>]
    : T extends [infer Head, ...infer Tail]
    ? QueriesOptions<[...Tail], [...Result, GetOptions<Head>], [...Depth, 1]>
    : unknown[] extends T
    ? T
    : T extends UseQueryOptions<infer TQueryFnData, infer TError, infer TData>[]
    ? UseQueryOptions<TQueryFnData, TError, TData>[]
    : UseQueryOptions[];

export function useTitumirQuery<T extends any[]>(
    queryFns: (api: Titumir) => readonly [...QueriesOptions<T>],
) {
    const api = useTitumirApiStore();
    const refreshToken = useTokenStore((s) => s.refreshToken);
    const setTokens = useTokenStore((s) => s.setTokens);

    const queries = queryFns(api).map((query: UseQueryOptions<unknown, TitumirError>) => {
        query.onError = (e) => {
            if (e?.status === 401 && refreshToken) {
                refreshTokenOnError(api, { refreshToken }, setTokens);
            }
            query.onError?.(e);
        };

        return query;
    }) as [...QueriesOptions<T>];

    const results = useQueries<T>(queries);

    return results;
}
