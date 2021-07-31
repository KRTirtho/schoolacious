import { GradeSchema } from "./grade";
import { SectionSchema } from "./section";
import { SubjectSchema } from "./subject";
import { BaseSchema, UserSchema } from "./user";

export interface TeachersToSectionsToGradesSchema extends BaseSchema {
    grade: GradeSchema;
    user: UserSchema;
    section: SectionSchema;
    subject: SubjectSchema;
    assigned_at: Date;
}
