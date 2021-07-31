import { ClassSchema } from "./class";
import { GradeSchema } from "./grade";
import { StudentsToSectionsToGradesSchema } from "./student-section-grade";
import { TeachersToSectionsToGradesSchema } from "./teacher-section-grade";
import { BaseSchema, UserSchema } from "./user";

export interface SectionSchema extends BaseSchema {
    name: string;
    grade: GradeSchema;
    teachersToSectionsToGrades?: TeachersToSectionsToGradesSchema[] | null;
    studentsToSectionsToGrade?: StudentsToSectionsToGradesSchema[] | null;
    classes?: ClassSchema[] | null;
    class_teacher?: UserSchema | null;
}
