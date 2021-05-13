import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Section from "../database/entity/sections.entity";
import UsersToSectionsToGrades from "../database/entity/users_sections_grades.entity";
import { GradeModule } from "../grade/grade.module";
import { SchoolModule } from "../school/school.module";
import { UserModule } from "../user/user.module";
import { SectionController } from "./section.controller";
import { SectionService } from "./section.service";
import { UserSectionGradeService } from "./user-section-grade.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Section, UsersToSectionsToGrades]),
    UserModule,
    SchoolModule,
    GradeModule,
  ],
  controllers: [SectionController],
  providers: [SectionService, UserSectionGradeService],
  exports: [UserSectionGradeService],
})
export class SectionModule {}
