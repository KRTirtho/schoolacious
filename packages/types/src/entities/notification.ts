import { NOTIFICATION_INDICATOR_ICON, NOTIFICATION_STATUS } from "../enums";
import { BaseSchema, UserSchema } from "./user";

export interface NotificationsSchema extends BaseSchema {
    owner_id: string;
    receiver: UserSchema;
    open_link: string;
    title: string;
    description: string;
    avatar_url: string;
    type_indicator_icon: NOTIFICATION_INDICATOR_ICON;
    status: NOTIFICATION_STATUS;
    created_at: Date;
}
