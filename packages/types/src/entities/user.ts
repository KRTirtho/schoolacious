import { USER_ROLE, USER_STATUS } from "../enums";
import { ClassSchema } from "./class";
import { Invitations_JoinsSchema } from "./invitation-join";
import { NotificationsSchema } from "./notification";
import { SchoolSchema } from "./school";
import { StudentsToSectionsToGradesSchema } from "./student-section-grade";
import { TeachersToSectionsToGradesSchema } from "./teacher-section-grade";

export interface BaseSchema {
    _id: string;
}

export interface UserSchema extends BaseSchema {
    email: string;
    first_name: string;
    last_name: string;
    role?: USER_ROLE | null;
    joined_on: Date;
    status?: USER_STATUS;
    teachersToSectionsToGrades?: TeachersToSectionsToGradesSchema[] | null;
    studentsToSectionsToGrade?: StudentsToSectionsToGradesSchema[] | null;
    classes?: ClassSchema[] | null;
    invitations_joins?: Invitations_JoinsSchema[] | null;
    notifications?: NotificationsSchema[] | null;
    school?: SchoolSchema | null;
}
