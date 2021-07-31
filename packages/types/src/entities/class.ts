import { CLASS_STATUS } from "../enums";
import { SectionSchema } from "./section";
import { BaseSchema, UserSchema } from "./user";

export interface ClassSchema extends BaseSchema {
    created_at: Date;
    day: number;
    time: string;
    section: SectionSchema;
    host: UserSchema;
    status: CLASS_STATUS;
    duration: number;
}
