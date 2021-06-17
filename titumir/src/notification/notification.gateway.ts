import { Logger } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";

@WebSocketGateway()
export class NotificationGateway {
    logger: Logger = new Logger(NotificationGateway.name);

    constructor(private authService: AuthService, private userService: UserService) {}

    @SubscribeMessage("message")
    handleMessage(client: Socket, payload: string): string {
        return "Hello world!";
    }
}
