import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import SocketIO, { Socket, Server as WsServer } from "socket.io";
import User from "../database/entity/users.entity";
import { USER_STATUS } from "@veschool/types";
import { UserService } from "../user/user.service";
import { Logger } from "@nestjs/common";

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    logger = new Logger(NotificationGateway.name);
    @WebSocketServer() public server!: WsServer;

    constructor(private userService: UserService) {}
    async handleDisconnect(client: Socket) {
        return await this.setUserStatus(client, USER_STATUS.offline);
    }

    async handleConnection(client: Socket) {
        return await this.setUserStatus(client, USER_STATUS.online);
    }

    private async setUserStatus(client: Socket, status: USER_STATUS) {
        try {
            // set the user's status to online on connect
            const { user } = client.handshake as SocketIO.Handshake & { user: User };

            await this.userService.update(user, { status });
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
