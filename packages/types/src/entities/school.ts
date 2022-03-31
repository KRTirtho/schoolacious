import { GradeSchema } from "./grade";
import { Invitations_JoinsSchema } from "./invitation-join";
import { SubjectSchema } from "./subject";
import { BaseSchema, UserSchema } from "./user";

export interface SchoolSchema extends BaseSchema {
    name: string;
    short_name: string;
    email: string;
    phone: string;
    description: string;
    admin: UserSchema;
    coAdmin1?: UserSchema | null;
    coAdmin2?: UserSchema | null;
    created_at: Date;
    users?: UserSchema[] | null;
    grades?: GradeSchema[] | null;
    invitations_joins?: Invitations_JoinsSchema[] | null;
    subjects?: SubjectSchema[] | null;
}
