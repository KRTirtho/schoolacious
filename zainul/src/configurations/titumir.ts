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

interface School {
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

interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: USER_ROLE | null;
    school?: School | null;
    joined_on: string | Date;
    status?: USER_STATUS;
}

type TitumirResponse<T> = Omit<Response, "json"> & { json: T };

interface LoginBody {
    email: string;
    password: string;
}

type SignupBody = LoginBody & Pick<User, "first_name" | "last_name">;

export default class Titumir {
    constructor(public baseURL: string) {}

    async buildRequest<ResData>(
        path: string,
        method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
        body?: Record<string | number, any>,
        options?: Omit<RequestInit, "body" | "method">,
    ): Promise<TitumirResponse<ResData>> {
        const { json, ...rest } = await fetch(this.baseURL + path, {
            method,
            body: body ? JSON.stringify(body) : null,
            ...options,
        });

        return {
            ...rest,
            json: await json(),
        };
    }

    async login(body: LoginBody) {
        return await this.buildRequest<User>("/auth/login", "POST", body);
    }

    async signup(body: SignupBody) {
        return await this.buildRequest<User>("/auth/signup", "POST", body);
    }
}
