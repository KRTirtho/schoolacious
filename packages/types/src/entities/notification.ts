import { NOTIFICATION_STATUS } from "../enums";
import { BaseSchema, UserSchema } from "./user";

export interface NotificationsSchema extends BaseSchema {
    user: UserSchema;
    message: string;
    src: string;
    status: NOTIFICATION_STATUS;
}
