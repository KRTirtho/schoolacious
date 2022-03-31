import { GradeToSubjectSchema } from "./grade_subject";
import { SchoolSchema } from "./school";
import { SectionSchema } from "./section";
import { StudentsToSectionsToGradesSchema } from "./student-section-grade";
import { TeachersToSectionsToGradesSchema } from "./teacher-section-grade";
import { BaseSchema, UserSchema } from "./user";

export interface GradeSchema extends BaseSchema{
    standard: number;
    created_at: Date;
    moderator?: UserSchema | null;
    examiner?: UserSchema | null;
    sections?: SectionSchema[] | null;
    grades_subjects?: GradeToSubjectSchema[] | null;
    teachersToSectionsToGrades?: TeachersToSectionsToGradesSchema[] | null;
    studentsToSectionsToGrade?: StudentsToSectionsToGradesSchema[] | null;
    school: SchoolSchema;
}