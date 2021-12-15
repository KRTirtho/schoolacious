import {
    UserSchema,
    USER_ROLE,
    Invitations_JoinsSchema,
    ClassSchema,
} from "@veschool/types";
import { StringifiableRecord } from "query-string";
import { UserSchemaWithGradesSections } from "state/authorization-store";
import { Connector, TitumirResponse } from "../Connector";

export interface ClassUpcomingOptions {
    diff?: number;
    day?: number;
    "current-time"?: string;
}
export class TitumirUserModule extends Connector {
    constructor(prefix: string) {
        super(prefix, "/user", TitumirUserModule.name);
    }

    async me(): Promise<TitumirResponse<UserSchemaWithGradesSections>> {
        return await this.buildRequest<UserSchemaWithGradesSections>("me");
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

    async listUpcomingClasses(
        opts: ClassUpcomingOptions = {},
    ): Promise<TitumirResponse<ClassSchema[]>> {
        const url = this.stringifyUrl({
            url: "upcoming-classes",
            query: opts as StringifiableRecord,
        });
        return await this.buildRequest<ClassSchema[]>(url);
    }
}
