import { CLASS_STATUS } from "../enums";
import { TeachersToSectionsToGradesSchema } from "./teacher-section-grade";
import { BaseSchema } from "./user";

export interface ClassSchema extends BaseSchema {
    created_at: Date;
    day: number;
    time: string;
    status: CLASS_STATUS;
    duration: number;
    host: TeachersToSectionsToGradesSchema;
    sessionId?: string;
}
