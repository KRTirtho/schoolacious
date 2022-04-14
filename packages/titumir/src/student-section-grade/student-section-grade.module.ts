import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import StudentsToSectionsToGrades from "../database/entity/students_sections_grades.entity";
import { NotificationModule } from "../notification/notification.module";
import { UserModule } from "../user/user.module";
import { StudentSectionGradeService } from "./student-section-grade.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentsToSectionsToGrades]),
        forwardRef(() => UserModule),
        NotificationModule,
    ],
    providers: [StudentSectionGradeService],
    exports: [StudentSectionGradeService],
})
export class StudentSectionGradeModule {}
