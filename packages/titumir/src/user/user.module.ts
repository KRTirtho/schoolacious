import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "../database/entity/users.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { InvitationJoinModule } from "../invitation-join/invitation-join.module";
import { TeacherSectionGradeModule } from "../teacher-section-grade/teacher-section-grade.module";
import { StudentSectionGradeModule } from "../student-section-grade/student-section-grade.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => InvitationJoinModule),
        forwardRef(() => TeacherSectionGradeModule),
        forwardRef(() => StudentSectionGradeModule),
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
