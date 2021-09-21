import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "../database/entity/users.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { InvitationJoinModule } from "../invitation-join/invitation-join.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
    imports: [
        forwardRef(() => InvitationJoinModule),
        TypeOrmModule.forFeature([User]),
        NotificationModule,
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
