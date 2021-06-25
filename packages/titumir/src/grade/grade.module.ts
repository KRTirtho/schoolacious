import { forwardRef, Module } from "@nestjs/common";
import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import Grade from "../database/entity/grades.entity";
import { SchoolModule } from "../school/school.module";
import { GradeSubjectService } from "./grade-subject.service";
import GradeToSubject from "../database/entity/grade_subject.entity";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        forwardRef(() => SchoolModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Grade, GradeToSubject]),
    ],
    controllers: [GradeController],
    providers: [GradeService, GradeSubjectService],
    exports: [GradeService],
})
export class GradeModule {}
