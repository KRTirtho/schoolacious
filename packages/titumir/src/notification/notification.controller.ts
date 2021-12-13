import { Body, Controller, Get, Logger, Put } from "@nestjs/common";
import { In } from "typeorm";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { UpdateNotificationByIdDto } from "./dto/update-notifications-by-id.dto";
import { NotificationService } from "./notification.service";

@Controller("notification")
export class NotificationController {
    logger: Logger = new Logger("NotificationController");

    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    async getNotifications(@CurrentUser() user: User) {
        try {
            return await this.notificationService.find({}, { where: { user } });
        } catch (error) {}
    }

    @Put("status")
    async updateStatus(@Body() { notifications, status }: UpdateNotificationByIdDto) {
        try {
            const updated = await this.notificationService.update(
                { _id: In(notifications) },
                { status },
            );

            return {
                message: `Notifications updated as ${status}`,
                affected: updated.affected,
            };
        } catch (error) {
            this.logger.error(error);
        }
    }
}
