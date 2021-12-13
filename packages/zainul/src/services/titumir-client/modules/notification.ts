import { NotificationsSchema, NOTIFICATION_STATUS } from "@veschool/types";
import { Connector, TitumirResponse } from "../Connector";

export interface NotificationUpdateProperties {
    notifications: string[];
    status: NOTIFICATION_STATUS;
}

export interface UpdateMultipleProperties {
    message: string;
    affected: number;
}

export class TitumirNotificationModule extends Connector {
    constructor(prefix: string) {
        super(prefix, "/notification", TitumirNotificationModule.name);
    }

    async list(): Promise<TitumirResponse<NotificationsSchema[]>> {
        return await this.buildRequest<NotificationsSchema[]>("/");
    }

    async updateStatus(
        data: NotificationUpdateProperties,
    ): Promise<TitumirResponse<UpdateMultipleProperties>> {
        return await this.buildRequest<
            UpdateMultipleProperties,
            NotificationUpdateProperties
        >("status", "PUT", data);
    }
}
