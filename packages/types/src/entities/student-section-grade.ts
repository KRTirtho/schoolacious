import { GradeSchema } from "./grade";
import { SectionSchema } from "./section";
import { BaseSchema, UserSchema } from "./user";

export interface StudentsToSectionsToGradesSchema extends BaseSchema {
    grade: GradeSchema;
    user: UserSchema;
    section: SectionSchema;
    assigned_at: Date;
}
