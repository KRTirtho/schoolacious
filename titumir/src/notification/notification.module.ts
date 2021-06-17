import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { NotificationGateway } from "./notification.gateway";

@Module({
    imports: [AuthModule, UserModule],
    providers: [NotificationGateway],
})
export class NotificationModule {}
