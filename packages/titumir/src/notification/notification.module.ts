import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Notifications from "../database/entity/notifications.entity";
import { NotificationGateway } from "./notification.gateway";
import { NotificationService } from "./notification.service";
import { NotificationController } from './notification.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Notifications])],
    providers: [NotificationGateway, NotificationService],
    exports: [NotificationGateway, NotificationService],
    controllers: [NotificationController],
})
export class NotificationModule {}
