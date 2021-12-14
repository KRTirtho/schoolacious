import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Section from "../database/entity/sections.entity";
import { GradeModule } from "../grade/grade.module";
import { SchoolModule } from "../school/school.module";
import { UserModule } from "../user/user.module";
import { SectionController } from "./section.controller";
import { SectionService } from "./section.service";
import { SubjectModule } from "../subject/subject.module";
import { TeacherSectionGradeModule } from "../teacher-section-grade/teacher-section-grade.module";
import { StudentSectionGradeModule } from "../student-section-grade/student-section-grade.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Section]),
        SchoolModule,
        GradeModule,
        SubjectModule,
        forwardRef(() => TeacherSectionGradeModule),
        StudentSectionGradeModule,
    ],
    controllers: [SectionController],
    providers: [SectionService],
    exports: [SectionService],
})
export class SectionModule {}
