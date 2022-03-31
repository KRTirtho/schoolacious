import { GradeToSubjectSchema } from "./grade_subject";
import { SchoolSchema } from "./school";
import { TeachersToSectionsToGradesSchema } from "./teacher-section-grade";
import { BaseSchema } from "./user";

export interface SubjectSchema extends BaseSchema {
    name: string;
    description: string;
    created_at: Date;
    school: SchoolSchema;
    grades_subjects?: GradeToSubjectSchema[] | null;
    teachersToSectionsToGrades?: TeachersToSectionsToGradesSchema[] | null;
}
