import { UserSchema } from "@veschool/types";
import { TitumirResponse } from "services/api/titumir";
import { Connector } from "../Connector";

export const CONST_REFRESH_TOKEN_KEY = "x-refresh-token";
export interface LoginProperties {
    email: string;
    password: string;
}

export type SignupProperties = LoginProperties &
    Pick<UserSchema, "first_name" | "last_name">;

export class TitumirAuthModule extends Connector {
    constructor() {
        super("/auth", TitumirAuthModule.name);
    }

    async login(body: LoginProperties): Promise<TitumirResponse<UserSchema>> {
        return await this.buildRequest<UserSchema>("login", "POST", body);
    }

    async signup(body: SignupProperties): Promise<TitumirResponse<UserSchema>> {
        return await this.buildRequest<UserSchema>("signup", "POST", body);
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
