import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchoolModule } from "../school/school.module";
import Class from "../database/entity/classes.entity";
import { NotificationModule } from "../notification/notification.module";
import { SectionModule } from "../section/section.module";
import { ClassesController } from "./classes.controller";
import { ClassesService } from "./classes.service";
import { TeacherSectionGradeModule } from "../teacher-section-grade/teacher-section-grade.module";
import { StudentSectionGradeModule } from "../student-section-grade/student-section-grade.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Class]),
        SectionModule,
        NotificationModule,
        SchoolModule,
        TeacherSectionGradeModule,
        StudentSectionGradeModule,
    ],
    controllers: [ClassesController],
    providers: [ClassesService],
    exports: [ClassesService],
})
export class ClassesModule {}
