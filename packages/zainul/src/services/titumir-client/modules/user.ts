import { UserSchema, USER_ROLE, Invitations_JoinsSchema } from "@veschool/types";
import { Connector, TitumirResponse } from "../Connector";

export class TitumirUserModule extends Connector {
    constructor(prefix: string) {
        super(prefix, "/user", TitumirUserModule.name);
    }

    async me(): Promise<TitumirResponse<UserSchema>> {
        return await this.buildRequest<UserSchema>("me");
    }

    async query(
        q: string,
        filters?: { school_id?: string; roles?: USER_ROLE[] },
    ): Promise<TitumirResponse<UserSchema[]>> {
        const url = this.stringifyUrl({
            url: "query",
            query: { q, school_id: filters?.school_id, role: filters?.roles?.join(":") },
        });
        return await this.buildRequest<UserSchema[]>(url);
    }

    async listInvitation(): Promise<TitumirResponse<Invitations_JoinsSchema[]>> {
        return await this.buildRequest<Invitations_JoinsSchema[]>("invitations");
    }

    async listJoinRequest(): Promise<TitumirResponse<Invitations_JoinsSchema[]>> {
        return await this.buildRequest<Invitations_JoinsSchema[]>("join-requests");
    }
}
