import { Module } from "@nestjs/common";
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
    TypeOrmModule.forFeature([Grade, GradeToSubject]),
    SchoolModule,
    UserModule,
  ],
  providers: [GradeService, GradeSubjectService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
