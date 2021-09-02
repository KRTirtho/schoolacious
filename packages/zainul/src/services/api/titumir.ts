import {
    SchoolSchema,
    UserSchema,
    GradeSchema,
    Invitations_JoinsSchema,
    SectionSchema,
    SubjectSchema,
} from "@veschool/types";
import qs from "query-string";

export type TitumirResponse<T> = Omit<Response, "json"> & { json: T };

export interface LoginBody {
    email: string;
    password: string;
}

export type SignupBody = LoginBody & Pick<UserSchema, "first_name" | "last_name">;

export const CONST_REFRESH_TOKEN_KEY = "x-refresh-token";

export enum INVITATION_OR_JOIN_ACTION {
    accept = "accept",
    reject = "reject",
}

export interface CompleteInvitationJoinBody {
    _id: string;
    action: INVITATION_OR_JOIN_ACTION;
}

export interface CreateSectionBody {
    section: string;
    class_teacher: string;
    grade: string | number;
}

export class TitumirError extends TypeError {
    status: number;
    body: Record<string | number, unknown>;

    constructor({
        statusText,
        url,
        status,
        body,
    }: {
        url: string;
        statusText: string;
        status: number;
        body: Record<string | number, unknown>;
    }) {
        super();
        this.stack = `[TitumirError "${statusText}"]: the following ${url} returned status ${status}`;
        this.status = status;
        this.body = body;
    }
}

export type HTTPMethods = "GET" | "POST" | "PUT" | "DELETE";

export type TitumirRequestOptions = Omit<RequestInit, "body" | "method">;

export type CreateSchool = Pick<
    SchoolSchema,
    "name" | "email" | "phone" | "description" | "short_name"
>;

export interface TitumirOptions {
    refreshToken?: string;
}

export enum INVITATION_OR_JOIN_TYPE {
    invitation = "invitation",
    join = "join",
}

export enum INVITATION_OR_JOIN_ROLE {
    teacher = "teacher",
    student = "student",
}

export interface Invitations_Joins {
    _id: string;
    type: INVITATION_OR_JOIN_TYPE;
    school: SchoolSchema;
    user: UserSchema;
    created_at: Date;
    role: INVITATION_OR_JOIN_ROLE;
}

export interface InvitationBody {
    user_id: string;
    role: INVITATION_OR_JOIN_ROLE;
}

export interface JoinBody {
    school_id: string;
    role: INVITATION_OR_JOIN_ROLE;
}

export type GradeBody = {
    standard: number;
    examiner: string;
    moderator: string;
};

export type CancelInvitationJoinBody = Pick<Invitations_JoinsSchema, "_id">;

export interface CoAdminBody {
    index: 1 | 2;
    email: string;
}

export interface CreateSubjectBody {
    name: string;
    description: string;
}

export default class Titumir {
    refreshToken?: string;
    constructor(public baseURL: string, options?: TitumirOptions) {
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
            });
        return Object.assign(res, { json: await res.json() });
    }
    setTokens({ refreshToken }: { refreshToken?: string | null }) {
        if (refreshToken) this.refreshToken = refreshToken;
        return this;
    }

    async login(body: LoginBody) {
        const res = await this.buildRequest<UserSchema>("/auth/login", "POST", body);
        const refreshToken = res.headers.get(CONST_REFRESH_TOKEN_KEY);
        this.setTokens({ refreshToken });
        return res;
    }

    async signup(body: SignupBody) {
        const res = await this.buildRequest<UserSchema>("/auth/signup", "POST", body);

        const refreshToken = res.headers.get(CONST_REFRESH_TOKEN_KEY);
        this.setTokens({ refreshToken });
        return res;
    }

    async refresh(token?: string) {
        const headers = new Headers();
        if (!token) token = this.refreshToken;
        if (!this.refreshToken && !token) throw new Error("refresh token doesn't exist");
        headers.append(CONST_REFRESH_TOKEN_KEY, token!);
        const res = await this.buildRequest<{ message: string }>(
            "/auth/refresh",
            "POST",
            undefined,
            {
                headers,
            },
        );
        const refreshToken = res.headers.get(CONST_REFRESH_TOKEN_KEY);
        this.setTokens({ refreshToken });
        return {
            ...res,
            tokens: { refreshToken },
        };
    }

    // =======/user/*=======

    async getMe() {
        return await this.buildRequest<UserSchema>("/user/me");
    }

    async queryUser(q: string, filters?: { school_id?: string; role?: string }) {
        const url = qs.stringifyUrl({
            url: "/user/query",
            query: { q, ...filters },
        });
        return await this.buildRequest<UserSchema[]>(url);
    }

    async getUserInvitations() {
        return await this.buildRequest<Invitations_JoinsSchema[]>("/user/invitations");
    }

    async getUserJoinRequests() {
        return await this.buildRequest<Invitations_JoinsSchema[]>("/user/join-requests");
    }

    // =======/school/*=======

    async getOrSearchSchool(
        search?: string,
        { noInviteJoin }: { noInviteJoin?: boolean } = {
            noInviteJoin: false,
        },
    ) {
        const url = qs.stringifyUrl({
            url: "/school",
            query: {
                q: search,
                "no-invite-join": noInviteJoin,
            },
        });
        return await this.buildRequest<SchoolSchema[]>(url);
    }

    async getSchool(short_name: string) {
        return await this.buildRequest<SchoolSchema>(`/school/${short_name}`);
    }

    async getSchoolInvitations(school: string) {
        return await this.buildRequest<Invitations_Joins[]>(
            `/school/${school}/invitations`,
        );
    }

    async getSchoolJoinRequests(school: string) {
        return await this.buildRequest<Invitations_Joins[]>(
            `/school/${school}/join-requests`,
        );
    }

    async getAllSchoolMembers(school: string) {
        return await this.buildRequest<UserSchema[]>(`/school/${school}/members`);
    }

    async createSchool(payload: CreateSchool) {
        const res = await this.buildRequest<SchoolSchema, CreateSchool>(
            "/school",
            "POST",
            payload,
        );
        return res;
    }

    async assignCoAdmins(school: string, data: CoAdminBody) {
        return await this.buildRequest<SchoolSchema, CoAdminBody>(
            `/school/${school}/co-admin`,
            "PUT",
            data,
        );
    }

    async getSchoolSubjects(school: string) {
        return await this.buildRequest<SubjectSchema[]>(`/school/${school}/subject`);
    }

    async createSubjects(school: string, data: CreateSubjectBody) {
        return await this.buildRequest<SubjectSchema, CreateSubjectBody>(
            `/school/${school}/subject`,
            "POST",
            data,
        );
    }

    // =======/invitation-join/*=======

    async invite(data: InvitationBody[]) {
        return await this.buildRequest<Invitations_Joins[], InvitationBody[]>(
            "/invitation-join/invite",
            "POST",
            data,
        );
    }

    async joinSchool(data: JoinBody) {
        return await this.buildRequest<Invitations_JoinsSchema, JoinBody>(
            "/invitation-join/join",
            "POST",
            data,
        );
    }

    // =======/grade/=======

    async createGrade(school: string, data: GradeBody) {
        return await this.buildRequest<GradeSchema, GradeBody>(
            `/school/${school}/grade`,
            "POST",
            data,
        );
    }

    async getGrades(school: string, query?: Partial<{ extended: string }>) {
        const url = qs.stringifyUrl({ url: `/school/${school}/grade`, query });
        return await this.buildRequest<GradeSchema[]>(url);
    }

    async completeInvitationJoin(data: CompleteInvitationJoinBody) {
        return await this.buildRequest<{ message: string }, CompleteInvitationJoinBody>(
            "/invitation-join/complete",
            "POST",
            data,
        );
    }

    async cancelInvitationJoin({ _id }: CancelInvitationJoinBody) {
        return await this.buildRequest<{ message: string }, CancelInvitationJoinBody>(
            "/invitation-join",
            "DELETE",
            { _id },
        );
    }

    // =======/section/=======
    async createSection(
        school: string,
        { class_teacher, grade, section }: CreateSectionBody,
    ) {
        return await this.buildRequest<
            SectionSchema,
            Record<"class_teacher" | "name", string>
        >(`/school/${school}/grade/${grade}/section`, "POST", {
            class_teacher,
            name: section,
        });
    }
}
