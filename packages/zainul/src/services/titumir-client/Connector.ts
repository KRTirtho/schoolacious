import { TitumirError } from "./TitumirError";
import qs from "query-string";
import urlJoin from "url-join";
// import { getCookie } from "utils/getCookie";

export type TitumirRequestOptions = Omit<RequestInit, "body" | "method">;
export type TitumirResponse<T> = Omit<Response, "json"> & { json: T };
export type HTTPMethods = "GET" | "POST" | "PUT" | "DELETE";

// const csrf: string | void = getCookie("_csrf");

export class Connector {
    csrf!: string;
    constructor(
        private _prefix: string,
        private _baseURL: string,
        private moduleName: string,
    ) {}

    async getCSRFToken(): Promise<string> {
        return fetch(urlJoin(this._prefix, "csrf")).then((s) => s.text());
    }

    async buildRequest<T, D = Record<string | number, any>>(
        path: string,
        method: HTTPMethods = "GET",
        body?: D,
        options?: TitumirRequestOptions,
    ): Promise<TitumirResponse<T>> {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        // if (method != "GET") headers.set("CSRF-TOKEN", csrf ?? "");

        Array.from(
            (options?.headers?.entries as () => IterableIterator<[string, string]>)?.() ??
                [],
        ).forEach(([key, val]) => headers.append(key, val));

        const url = urlJoin(this._prefix, this._baseURL, path);
        // if (method != "GET")
        //     url = this.qs.stringifyUrl({ url, query: { _csrf: csrf ?? "" } });

        const res = await fetch(url, {
            method,
            body: body ? JSON.stringify(body) : null,
            credentials: "include",
            ...options,
            headers,
        });

        if (!res.ok)
            throw new TitumirError({
                status: res.status,
                statusText: res.statusText,
                url: res.url,
                body: await res.json(),
                moduleName: this.moduleName,
            });
        return Object.assign(res, { json: await res.json() });
    }

    private qs = qs;

    public stringifyUrl = this.qs.stringifyUrl;
    public stringify = this.qs.stringify;
    public parse = this.qs.parse;
    public parseUrl = this.qs.parseUrl;
    public exclude = this.qs.exclude;
    public extract = this.qs.extract;
    public pick = this.qs.pick;

    public get baseURL(): string {
        return this._baseURL;
    }

    public set baseURL(url: string) {
        this._baseURL = url;
    }

    public get prefix(): string {
        return this._prefix;
    }

    public set prefix(prefix: string) {
        this._prefix = prefix;
    }
}
