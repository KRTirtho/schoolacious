export enum USER_ROLE {
    admin = "admin",
    coAdmin = "co-admin",
    gradeModerator = "grade-moderator",
    gradeExaminer = "grade-examiner",
    classTeacher = "class-teacher",
    teacher = "teacher",
    student = "student",
}

export enum USER_STATUS {
    online = "online",
    offline = "offline",
}

export interface School {
    _id: string;
    name: string;
    short_name: string;
    email: string;
    phone: string;
    description: string;
    admin: User;
    coAdmin1?: User | null;
    coAdmin2?: User | null;
    created_at: string | Date;
}

export interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: USER_ROLE | null;
    school?: School | null;
    joined_on: string | Date;
    status?: USER_STATUS;
}

export type TitumirResponse<T> = Omit<Response, "json"> & { json: T };

export interface LoginBody {
    email: string;
    password: string;
}

export type SignupBody = LoginBody & Pick<User, "first_name" | "last_name">;

export const CONST_ACCESS_TOKEN_KEY = "x-access-token";
export const CONST_REFRESH_TOKEN_KEY = "x-refresh-token";

export class TitumirError extends TypeError {
    status: number;

    constructor({
        statusText,
        url,
        status,
    }: {
        url: string;
        statusText: string;
        status: number;
    }) {
        super();
        this.stack = `[TitumirError "${statusText}"]: the following ${url} returned status ${status}`;
        this.status = status;
    }
}

export type HTTPMethods = "GET" | "POST" | "PUT" | "DELETE";

export type TitumirRequestOptions = Omit<RequestInit, "body" | "method">;

export type CreateSchool = Pick<
    School,
    "name" | "email" | "phone" | "description" | "short_name"
>;

export interface TitumirOptions {
    accessToken?: string;
    refreshToken?: string;
}

export default class Titumir {
    accessToken?: string;
    refreshToken?: string;
    constructor(public baseURL: string, options?: TitumirOptions) {
        this.accessToken = options?.accessToken;
        this.refreshToken = options?.refreshToken;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async buildRequest<T, D = Record<string | number, any>>(
        path: string,
        method: HTTPMethods = "GET",
        body?: D,
        options?: TitumirRequestOptions,
    ): Promise<TitumirResponse<T>> {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");

        Array.from(
            (options?.headers?.entries as () => IterableIterator<[string, string]>)?.() ??
                [],
        ).forEach(([key, val]) => headers.append(key, val));

        const res = await fetch(this.baseURL + path, {
            method,
            body: body ? JSON.stringify(body) : null,
            ...options,
            headers,
        });

        if (!res.ok)
            throw new TitumirError({
                status: res.status,
                statusText: res.statusText,
                url: res.url,
            });
        return Object.assign(res, { json: await res.json() });
    }
    setTokens({
        accessToken,
        refreshToken,
    }: {
        accessToken?: string | null;
        refreshToken?: string | null;
    }) {
        if (accessToken) this.accessToken = accessToken;
        if (refreshToken) this.refreshToken = refreshToken;
    }

    async login(body: LoginBody) {
        const res = await this.buildRequest<User>("/auth/login", "POST", body);
        const accessToken = res.headers.get(CONST_ACCESS_TOKEN_KEY);
        const refreshToken = res.headers.get(CONST_REFRESH_TOKEN_KEY);
        this.setTokens({ accessToken, refreshToken });
        return res;
    }

    async signup(body: SignupBody) {
        const res = await this.buildRequest<User>("/auth/signup", "POST", body);

        const accessToken = res.headers.get(CONST_ACCESS_TOKEN_KEY);
        const refreshToken = res.headers.get(CONST_REFRESH_TOKEN_KEY);
        this.setTokens({ accessToken, refreshToken });
        return res;
    }

    async refresh(token?: string) {
        const headers = new Headers();
        if (!token) token = this.refreshToken;
        if (!this.refreshToken && !token) throw new Error("refresh token doesn't exist");
        headers.append(CONST_REFRESH_TOKEN_KEY, token!);
        const res = await this.buildRequest<{ message: string; user: User }>(
            "/auth/refresh",
            "POST",
            undefined,
            {
                headers,
            },
        );
        const accessToken = res.headers.get(CONST_ACCESS_TOKEN_KEY);
        const refreshToken = res.headers.get(CONST_REFRESH_TOKEN_KEY);
        this.setTokens({ accessToken, refreshToken });
        return {
            ...res,
            tokens: { accessToken, refreshToken },
        };
    }

    async buildAuthReq<T, D = Record<string | number, unknown>>(
        path: string,
        method: HTTPMethods = "GET",
        body?: D,
        options?: TitumirRequestOptions,
    ): Promise<TitumirResponse<T>> {
        if (!this.accessToken) throw new Error("access token doesn't exist");
        const headers = new Headers();
        headers.set("Authorization", `Bearer ${this.accessToken}`);
        Array.from(
            (options?.headers?.entries as () => IterableIterator<[string, string]>)?.() ??
                [],
        ).forEach(([key, val]) => headers.append(key, val));

        const res = await this.buildRequest<T>(path, method, body, {
            ...options,
            headers,
        });
        return res;
    }

    async getSchool(short_name: string) {
        return await this.buildAuthReq<School>(`/school/${short_name}`);
    }

    async createSchool(payload: CreateSchool) {
        const res = await this.buildAuthReq<School, CreateSchool>(
            "/school",
            "POST",
            payload,
        );
        return res;
    }
}
