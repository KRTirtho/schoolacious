import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import TeachersToSectionsToGrades from "../database/entity/teachers_sections_grades.entity";
import { SectionModule } from "../section/section.module";
import { SubjectModule } from "../subject/subject.module";
import { UserModule } from "../user/user.module";
import { TeacherSectionGradeService } from "./teacher-section-grade.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([TeachersToSectionsToGrades]),
        forwardRef(() => UserModule),
        SubjectModule,
        forwardRef(() => SectionModule),
    ],
    providers: [TeacherSectionGradeService],
    exports: [TeacherSectionGradeService],
})
export class TeacherSectionGradeModule {}
