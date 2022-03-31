import { UserSchema } from "@schoolacious/types";
import { Connector, TitumirResponse } from "../Connector";

export const CONST_REFRESH_TOKEN_KEY = "x-refresh-token";
export interface LoginProperties {
    email: string;
    password: string;
}

export type SignupProperties = LoginProperties &
    Pick<UserSchema, "first_name" | "last_name">;

export class TitumirAuthModule extends Connector {
    constructor(prefix: string) {
        super(prefix, "/auth", TitumirAuthModule.name);
    }

    async login(body: LoginProperties): Promise<TitumirResponse<UserSchema>> {
        return await this.buildRequest<UserSchema, LoginProperties>(
            "login",
            "POST",
            body,
        );
    }

    async signup(body: SignupProperties): Promise<TitumirResponse<UserSchema>> {
        return await this.buildRequest<UserSchema, SignupProperties>(
            "signup",
            "POST",
            body,
        );
    }

    async refresh(token: string) {
        const headers = new Headers();

        headers.append(CONST_REFRESH_TOKEN_KEY, token);
        const res = await this.buildRequest<{ message: string }>(
            "refresh",
            "POST",
            undefined,
            {
                headers,
            },
        );
        const refreshToken = res.headers.get(CONST_REFRESH_TOKEN_KEY);

        return {
            ...res,
            tokens: { refreshToken },
        };
    }

    async logout(): Promise<TitumirResponse<null>> {
        return await this.buildRequest<null>("logout");
    }
}
