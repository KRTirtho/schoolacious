import {
    Invitations_JoinsSchema,
    INVITATION_OR_JOIN_ROLE,
    INVITATION_OR_JOIN_TYPE,
    SchoolSchema,
    UserSchema,
} from "@veschool/types";
import { Connector, TitumirResponse } from "../Connector";

export enum INVITATION_OR_JOIN_ACTION {
    accept = "accept",
    reject = "reject",
}
export interface InvitationJoinCompletionProperties {
    _id: string;
    action: INVITATION_OR_JOIN_ACTION;
}

export type InvitationJoinCancellationProperties = Pick<Invitations_JoinsSchema, "_id">;

export interface Invitations_Joins {
    _id: string;
    type: INVITATION_OR_JOIN_TYPE;
    school: SchoolSchema;
    user: UserSchema;
    created_at: Date;
    role: INVITATION_OR_JOIN_ROLE;
}

export interface InvitationProperties {
    user_id: string;
    role: INVITATION_OR_JOIN_ROLE;
}

export interface JoinRequestProperties {
    school_id: string;
    role: INVITATION_OR_JOIN_ROLE;
}

export class TitumirInvitationJoinModule extends Connector {
    constructor(prefix: string) {
        super(prefix, "/invitation-join", TitumirInvitationJoinModule.name);
    }

    async createInvitations(
        data: InvitationProperties[],
    ): Promise<TitumirResponse<Invitations_Joins[]>> {
        return await this.buildRequest<Invitations_Joins[], InvitationProperties[]>(
            "invite",
            "POST",
            data,
        );
    }

    async createJoinRequest(
        data: JoinRequestProperties,
    ): Promise<TitumirResponse<Invitations_JoinsSchema>> {
        return await this.buildRequest<Invitations_JoinsSchema, JoinRequestProperties>(
            "join",
            "POST",
            data,
        );
    }

    async complete(data: InvitationJoinCompletionProperties) {
        return await this.buildRequest<
            { message: string },
            InvitationJoinCompletionProperties
        >("complete", "POST", data);
    }

    async cancel({ _id }: InvitationJoinCancellationProperties) {
        return await this.buildRequest<
            { message: string },
            InvitationJoinCancellationProperties
        >("/", "DELETE", { _id });
    }
}
