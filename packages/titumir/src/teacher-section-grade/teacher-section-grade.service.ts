import {
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Subject from "../database/entity/subjects.entity";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import Grade from "../database/entity/grades.entity";
import School from "../database/entity/schools.entity";
import Section from "../database/entity/sections.entity";
import TeachersToSectionsToGrades from "../database/entity/teachers_sections_grades.entity";
import User from "../database/entity/users.entity";
import { USER_ROLE } from "@schoolacious/types";
import { SubjectService } from "../subject/subject.service";
import { UserService } from "../user/user.service";
import { SectionService } from "../section/section.service";
import { TeacherDTO } from "../section/dto/teacher-student.dto";

@Injectable()
export class TeacherSectionGradeService extends BasicEntityService<TeachersToSectionsToGrades> {
    constructor(
        @InjectRepository(TeachersToSectionsToGrades)
        private readonly tsgRepo: Repository<TeachersToSectionsToGrades>,
        private userService: UserService,
        private subjectService: SubjectService,
        private sectionService: SectionService,
    ) {
        super(tsgRepo);
    }

    async addTeachers(
        { email, subject_id }: TeacherDTO,
        school: School,
        grade: Grade,
        section: Section,
    ) {
        const user = await this.userService.findOne(
            { email },
            {
                relations: ["school"],
            },
        );

        // not allowing school outsiders to join the section
        if (user.school?._id !== school._id)
            throw new NotAcceptableException("user doesn't belong to the school");
        // students can't be added as a teacher to any section
        else if (user.role === USER_ROLE.student)
            throw new NotAcceptableException("can't add a student as a teacher");

        const subject = await this.subjectService.findOne({ _id: subject_id });

        // tsg = Teacher Section Grade (subject)
        const tsg = await this.create({ user, subject, grade, section });

        Object.assign(tsg.user, { ...tsg.user, school: undefined });

        return tsg;
    }

    //!! this method is incomplete & only for working states it was created
    //!! a lot of work need to get done here like (removing classes,
    //!! updating class schedules, exam reconfiguring etc...)
    async removeTeacher(
        { subject, user }: { user: string | User; subject: string | Subject },
        section: string | Section,
    ) {
        if (typeof user === "string")
            user = await this.userService.findOne({ email: user });
        if (typeof section === "string")
            section = await this.sectionService.findOne({ _id: section });
        if (typeof subject === "string")
            subject = await this.subjectService.findOne({ _id: subject });
        const tsg = await this.findOne({ user, subject, section });
        delete (tsg as any).assigned_at;
        const tsgDel = await this.tsgRepo.delete(tsg);
        if (tsgDel.affected !== 1)
            throw new InternalServerErrorException("failed removing teacher");
        return { message: "successfully removed teacher" };
    }
}
