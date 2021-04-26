import { Module } from "@nestjs/common";
import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import Grade from "../database/entity/grades.entity";
import { SchoolModule } from "../school/school.module";

@Module({
  imports: [TypeOrmModule.forFeature([Grade]), SchoolModule],
  providers: [GradeService],
  controllers: [GradeController],
})
export class GradeModule {}
