import { Module } from "@nestjs/common";
import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import Grade from "../database/entity/grades.entity";
import { SchoolModule } from "../school/school.module";
import { GradeSubjectService } from "./grade-section.service";
import GradeToSubject from "../database/entity/grade_subject.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Grade, GradeToSubject]), SchoolModule],
  providers: [GradeService, GradeSubjectService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
