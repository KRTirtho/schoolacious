import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Section from "../database/entity/sections.entity";
import { GradeModule } from "../grade/grade.module";
import { SchoolModule } from "../school/school.module";
import { UserModule } from "../user/user.module";
import { SectionController } from "./section.controller";
import { SectionService } from "./section.service";
import { StudentSectionGradeService } from "./student-section-grade.service";
import { TeacherSectionGradeService } from "./teacher-section-grade.service";
import TeachersToSectionsToGrades from "../database/entity/teachers_sections_grades.entity";
import StudentsToSectionsToGrades from "../database/entity/students_sections_grades.entity";
import { SubjectModule } from "../subject/subject.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Section,
            TeachersToSectionsToGrades,
            StudentsToSectionsToGrades,
        ]),
        UserModule,
        SchoolModule,
        GradeModule,
        SubjectModule,
    ],
    controllers: [SectionController],
    providers: [SectionService, StudentSectionGradeService, TeacherSectionGradeService],
    exports: [StudentSectionGradeService, TeacherSectionGradeService],
})
export class SectionModule {}
