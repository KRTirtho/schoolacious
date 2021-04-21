import { forwardRef, Module } from "@nestjs/common";
import { InvitationJoinService } from "./invitation-join.service";
import { InvitationJoinController } from "./invitation-join.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import Invitations_Joins from "../database/entity/invitations_or_joins.entity";
import { UserModule } from "../user/user.module";
import { SchoolModule } from "../school/school.module";

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => SchoolModule),
    TypeOrmModule.forFeature([Invitations_Joins]),
  ],
  providers: [InvitationJoinService],
  controllers: [InvitationJoinController],
  exports: [InvitationJoinService],
})
export class InvitationJoinModule {}
