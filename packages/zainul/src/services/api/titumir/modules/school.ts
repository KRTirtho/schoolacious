import { SchoolSchema, SubjectSchema, UserSchema } from "@veschool/types";
import { Invitations_Joins, TitumirResponse } from "services/api/titumir";
import { Connector } from "../Connector";

export interface SchoolListOptions {
    noInviteJoin?: boolean;
    search?: string;
}

export type SchoolProperties = Pick<
    SchoolSchema,
    "name" | "email" | "phone" | "description" | "short_name"
>;

export interface AddCoAdminProperties {
    index: 1 | 2;
    email: string;
}
export interface SubjectProperties {
    name: string;
    description: string;
}

export class TitumirSchoolModule extends Connector {
    constructor(public schoolId?: string) {
        super("/school", TitumirSchoolModule.name);
    }

    public setSchoolId(schoolId: string) {
        this.schoolId = schoolId;
    }

    private verifySchoolId(school: string | undefined): string {
        const id = school ?? this.schoolId;
        if (!id) throw TypeError("[TitumirSchoolError]: School Id isn't provided");
        return id;
    }

    async list(options?: SchoolListOptions): Promise<TitumirResponse<SchoolSchema[]>> {
        const query = {
            q: options?.search,
            "no-invite-join": options?.noInviteJoin,
        };
        const url = this.stringifyUrl({
            url: "/",
            query,
        });
        return await this.buildRequest<SchoolSchema[]>(url);
    }

    async get(short_name: string): Promise<TitumirResponse<SchoolSchema>> {
        return await this.buildRequest<SchoolSchema>(short_name);
    }

    async listInvitations(
        school?: string,
    ): Promise<TitumirResponse<Invitations_Joins[]>> {
        const id = this.verifySchoolId(school);
        return await this.buildRequest<Invitations_Joins[]>(`${id}/invitations`);
    }

    async listJoinRequests(
        school?: string,
    ): Promise<TitumirResponse<Invitations_Joins[]>> {
        const id = this.verifySchoolId(school);
        return await this.buildRequest<Invitations_Joins[]>(`${id}/join-requests`);
    }

    async listMembers(school?: string): Promise<TitumirResponse<UserSchema[]>> {
        const id = this.verifySchoolId(school);
        return await this.buildRequest<UserSchema[]>(`${id}/members`);
    }

    async create(payload: SchoolProperties): Promise<TitumirResponse<SchoolSchema>> {
        return await this.buildRequest<SchoolSchema, SchoolProperties>(
            "/",
            "POST",
            payload,
        );
    }

    async addCoAdmin(
        data: AddCoAdminProperties,
        school?: string,
    ): Promise<TitumirResponse<SchoolSchema>> {
        const id = this.verifySchoolId(school);
        return await this.buildRequest<SchoolSchema, AddCoAdminProperties>(
            `${id}/co-admin`,
            "PUT",
            data,
        );
    }
    async listSubjects(school?: string): Promise<TitumirResponse<SubjectSchema[]>> {
        const id = this.verifySchoolId(school);
        return await this.buildRequest<SubjectSchema[]>(`${id}/subject`);
    }

    async createSubject(
        data: SubjectProperties,
        school?: string,
    ): Promise<TitumirResponse<SubjectSchema>> {
        const id = this.verifySchoolId(school);
        return await this.buildRequest<SubjectSchema, SubjectProperties>(
            `${id}/subject`,
            "POST",
            data,
        );
    }
}
