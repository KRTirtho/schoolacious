import { GradeSchema } from "./grade";
import { SubjectSchema } from "./subject";
import { BaseSchema } from "./user";

export interface GradeToSubjectSchema extends BaseSchema {
    grade: GradeSchema;
    subject: SubjectSchema;
    mark: number;
}
