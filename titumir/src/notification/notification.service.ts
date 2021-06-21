import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import Notifications from "../database/entity/notifications.entity";

@Injectable()
export class NotificationService extends BasicEntityService<Notifications> {
    constructor(
        @InjectRepository(Notifications)
        private notificationsRepo: Repository<Notifications>,
    ) {
        super(notificationsRepo);
    }
}
