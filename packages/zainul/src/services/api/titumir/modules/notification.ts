import { NotificationsSchema, NOTIFICATION_STATUS } from "@veschool/types";
import { TitumirResponse } from "services/api/titumir";
import { Connector } from "../Connector";

interface NotificationUpdateProperties {
    notifications: string[];
    status: NOTIFICATION_STATUS;
}

export class TitumirNotificationModule extends Connector {
    constructor() {
        super("/notification", TitumirNotificationModule.name);
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
