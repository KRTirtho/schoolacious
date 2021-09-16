import {
    SchoolSchema,
    UserSchema,
    GradeSchema,
    Invitations_JoinsSchema,
    SectionSchema,
    SubjectSchema,
    GradeToSubjectSchema,
    TeachersToSectionsToGradesSchema,
    StudentsToSectionsToGradesSchema,
    ClassSchema,
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
        this.body = body;
        this.stack = `[TitumirError "${statusText}"]: the following ${url} returned status ${status} \n [Response]: ${JSON.stringify(
            this.body,
            null,
            2,
        )}`;
        this.status = status;
    }
}

export type HTTPMethods = "GET" | "POST" | "PUT" | "DELETE";

export type TitumirRequestOptions = Omit<RequestInit, "body" | "method">;

export type CreateSchool = Pick<
    SchoolSchema,
    "name" | "email" | "phone" | "description" | "short_name"
>;

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

export interface AddGradeSubjectsBody {
    subject_id: string;
    mark: number;
}

export type SectionWithSubject = Omit<SectionSchema, "grade"> & {
    subjects: { subject: SubjectSchema; teacher: UserSchema | null }[] | null;
};

export interface AssignSectionTeacherBody {
    email: string;
    subject_id: string;
}

export type AddSectionStudentsBody = Pick<UserSchema, "_id">;

export interface AddSectionStudentsReturns {
    users: StudentsToSectionsToGradesSchema[];
    error: string[];
}

export interface ScheduleClassBody {
    day: number;
    time: string;
    host: string;
    duration: number;
}

export default class Titumir {
    constructor(public baseURL: string) {}

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
    async login(body: LoginBody) {
        return await this.buildRequest<UserSchema>("/auth/login", "POST", body);
    }

    async signup(body: SignupBody) {
        return await this.buildRequest<UserSchema>("/auth/signup", "POST", body);
    }

    async refresh(token: string) {
        const headers = new Headers();

        headers.append(CONST_REFRESH_TOKEN_KEY, token);
        const res = await this.buildRequest<{ message: string }>(
            "/auth/refresh",
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

    async logout() {
        return await this.buildRequest("/auth/logout");
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

    async addGradeSubjects(
        school: string,
        grade: number,
        subjects: AddGradeSubjectsBody[],
    ) {
        return await this.buildRequest<GradeToSubjectSchema[], AddGradeSubjectsBody[]>(
            `/school/${school}/grade/${grade}/subject`,
            "POST",
            subjects,
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

    async getSection(school: string, grade: number, section: string) {
        return await this.buildRequest<SectionWithSubject>(
            `/school/${school}/grade/${grade}/section/${section}`,
        );
    }

    async assignSectionTeacher(
        school: string,
        grade: number,
        section: string,
        data: AssignSectionTeacherBody,
    ) {
        return await this.buildRequest<
            TeachersToSectionsToGradesSchema,
            AssignSectionTeacherBody
        >(`/school/${school}/grade/${grade}/section/${section}/teacher`, "PUT", data);
    }

    async addSectionStudents(
        school: string,
        grade: number,
        section: string,
        data: AddSectionStudentsBody[],
    ) {
        return await this.buildRequest<
            AddSectionStudentsReturns,
            AddSectionStudentsBody[]
        >(`/school/${school}/grade/${grade}/section/${section}/students`, "PUT", data);
    }

    async getSectionTeachers(school: string, grade: number, section: string) {
        return await this.buildRequest<TeachersToSectionsToGradesSchema[]>(
            `/school/${school}/grade/${grade}/section/${section}/teachers`,
        );
    }

    // =====/classes/=====
    async getClasses(school: string, grade: number, section: string) {
        return await this.buildRequest<ClassSchema[]>(
            `/school/${school}/grade/${grade}/section/${section}/class`,
        );
    }

    async createClass(
        school: string,
        grade: number,
        section: string,
        data: ScheduleClassBody,
    ) {
        return await this.buildRequest<ClassSchema, ScheduleClassBody>(
            `/school/${school}/grade/${grade}/section/${section}/class`,
            "POST",
            data,
        );
    }
}
