import { Module } from "@nestjs/common";
import { InvitationJoinService } from "./invitation-join.service";
import { InvitationJoinController } from "./invitation-join.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import Invitations_Joins from "../database/entity/invitations_or_joins.entity";
import { UserModule } from "../user/user.module";
import { SchoolModule } from "../school/school.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitations_Joins]),
    UserModule,
    SchoolModule,
  ],
  providers: [InvitationJoinService],
  controllers: [InvitationJoinController],
})
export class InvitationJoinModule {}
