import { NotificationsSchema, NOTIFICATION_STATUS } from "@veschool/types";
import { Connector, TitumirResponse } from "../Connector";

interface NotificationUpdateProperties {
    notifications: string[];
    status: NOTIFICATION_STATUS;
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
    ): Promise<TitumirResponse<{ message: string; affected: number }>> {
        return await this.buildRequest<
            { message: string; affected: number },
            NotificationUpdateProperties
        >("status", "PUT", data);
    }
}
