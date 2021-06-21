import { Logger } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import SocketIO, { Socket, Server as WsServer } from "socket.io";
import User, { USER_STATUS } from "../database/entity/users.entity";
import { UserService } from "../user/user.service";

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    logger: Logger = new Logger(NotificationGateway.name);

    @WebSocketServer() public server!: WsServer;

    constructor(private userService: UserService) {}

    async handleDisconnect(client: Socket) {
        return await this.setUserStatus(client, USER_STATUS.offline);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        return await this.setUserStatus(client, USER_STATUS.online);
    }

    private async setUserStatus(client: Socket, status: USER_STATUS) {
        try {
            // set the user's status to online on connect
            const { user } = client.handshake as SocketIO.Handshake & { user: User };

            await this.userService.update(user, { status });
        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }

    @SubscribeMessage("message")
    handleMessage(client: Socket, payload: string): string {
        return "Hello world!";
    }

    sendNotification() {}
}
