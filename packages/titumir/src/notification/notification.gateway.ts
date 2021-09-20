import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server as WsServer } from "socket.io";
import User, { UserCache } from "../database/entity/users.entity";
import { USER_STATUS } from "@veschool/types";
import { CACHE_MANAGER, Inject, Logger } from "@nestjs/common";
import { Handshake } from "socket.io/dist/socket";
import { Cache } from "cache-manager";

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    logger = new Logger(NotificationGateway.name);
    @WebSocketServer() public server!: WsServer;

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
            const { user } = client.handshake as Handshake & { user: User };

            await this.cacheManager.set<UserCache>(user._id, { status, id: client.id });
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @SubscribeMessage("message")
    handleMessage(): string {
        return "Hello world!";
    }

    sendNotification() {
        return;
    }
}
