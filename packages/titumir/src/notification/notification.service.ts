import { CACHE_MANAGER, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebSocketServer } from "@nestjs/websockets";
import { Repository } from "typeorm";
import { WS_SERVER_EVENTS } from "@schoolacious/types";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import Notifications from "../database/entity/notifications.entity";
import { Server as WsServer } from "socket.io";
import { Cache } from "cache-manager";

@Injectable()
export class NotificationService extends BasicEntityService<Notifications> {
    logger = new Logger(NotificationService.name);

    @WebSocketServer() public server!: WsServer;
    constructor(
        @InjectRepository(Notifications)
        private notificationsRepo: Repository<Notifications>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        super(notificationsRepo);
    }

    /**
     * Sends notification to the user having the provided `_id`
     * Notification is sent to all connected devices of the user via WS
     *
     * @param _id - any User's id
     * @param notification - notification to be sent but without the
     * `receiver` property
     */
    async sendNotification(_id: string, notification: Omit<Notifications, "receiver">) {
        try {
            const ids = await this.cacheManager.get<string[]>(_id);
            if (!ids) return;
            for (const id of ids) {
                this.server.sockets.sockets
                    .get(id)
                    ?.emit(WS_SERVER_EVENTS.notification, notification);
            }
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
