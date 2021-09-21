import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import User from "../database/entity/users.entity";
import { USER_STATUS } from "@veschool/types";
import { CACHE_MANAGER, Inject, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { IncomingMessage } from "http";

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    logger = new Logger(NotificationGateway.name);

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async handleDisconnect(client: Socket) {
        return await this.setUserStatus(client, USER_STATUS.offline);
    }

    async handleConnection(client: Socket) {
        return await this.setUserStatus(client, USER_STATUS.online);
    }

    private async setUserStatus(client: Socket, status: USER_STATUS) {
        try {
            // set the user's status to online on connect
            const { user } = client.request as IncomingMessage & { user: User };

            // This ws connection has to be support multiple
            // devices (5 max) in parallel. Thus save array of socket-ids
            // instead of one string

            let cachedUser = (await this.cacheManager.get<string[]>(user._id)) ?? [];

            if (status === USER_STATUS.online) {
                if (cachedUser.length > 5) cachedUser.shift();
                cachedUser = [...cachedUser, client.id];
            } else {
                cachedUser = cachedUser.filter((id) => id !== client.id);
            }

            if (cachedUser.length === 0) {
                await this.cacheManager.del(user._id);
            } else {
                await this.cacheManager.set<string[]>(user._id, cachedUser);
            }
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @SubscribeMessage("message")
    handleMessage(): string {
        return "Hello world!";
    }
}
