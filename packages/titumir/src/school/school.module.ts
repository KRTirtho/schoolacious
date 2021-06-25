import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import School from "../database/entity/schools.entity";
import { GradeModule } from "../grade/grade.module";
import { InvitationJoinModule } from "../invitation-join/invitation-join.module";
import { UserModule } from "../user/user.module";
import { SchoolController } from "./school.controller";
import { SchoolService } from "./school.service";

@Module({
    imports: [
        forwardRef(() => InvitationJoinModule),
        TypeOrmModule.forFeature([School]),
        forwardRef(() => GradeModule),
        forwardRef(() => UserModule),
    ],
    controllers: [SchoolController],
    providers: [SchoolService],
    exports: [SchoolService],
})
export class SchoolModule {}
