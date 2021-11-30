import { Controller, Get, Logger } from "@nestjs/common";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { NotificationService } from "./notification.service";

@Controller("notification")
export class NotificationController {
    logger: Logger = new Logger("NotificationController");

    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    async getNotifications(@CurrentUser() user: User) {
        try {
            return await this.notificationService.find({}, { where: { user } });
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
