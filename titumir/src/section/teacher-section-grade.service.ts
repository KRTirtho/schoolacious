import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, In, Repository } from "typeorm";
import Subject from "../database/entity/subjects.entity";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import Grade from "../database/entity/grades.entity";
import School from "../database/entity/schools.entity";
import Section from "../database/entity/sections.entity";
import TeachersToSectionsToGrades from "../database/entity/teachers_sections_grades.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { SubjectService } from "../subject/subject.service";
import { UserService } from "../user/user.service";
import { SectionService } from "./section.service";
import groupBy from "lodash/groupBy";
import { TeacherDTO } from "./dto/teacher-student.dto";

@Injectable()
export class TeacherSectionGradeService extends BasicEntityService<TeachersToSectionsToGrades> {
  constructor(
    @InjectRepository(TeachersToSectionsToGrades)
    private readonly tsgRepo: Repository<TeachersToSectionsToGrades>,
    private userService: UserService,
    private subjectService: SubjectService,
    private sectionService: SectionService
  ) {
    super(tsgRepo);
  }

  async addTeachers(
    payloads: TeacherDTO[],
    school: School,
    grade: Grade,
    section: Section
  ) {
    const users = await this.userService.find(
      {},
      {
        relations: ["school"],
        where: { _id: In(payloads.map(({ _id: user_id }) => user_id)) },
      }
    );
    const errors = [];
    const validUsers: User[] = [];

    for (const user of users) {
      // not allowing school outsiders to join the section
      if (user.school?._id !== school._id)
        errors.push({
          user: user._id,
          message: `user doesn't belong to the school`,
        });
      // students can't be added as a teacher to any section
      else if (user.role === USER_ROLE.student)
        errors.push({
          user: user._id,
          message: `can't add a student as a teacher`,
        });
      else {
        validUsers.push(user);
      }
    }
    const sortedValidUsers = validUsers.sort((a, b) =>
      a._id > b._id ? 1 : -1
    );
    const validUserIds = sortedValidUsers.map(({ _id }) => _id);
    // keeping only the payloads of the users that are in validUser
    // this filters the subject_id too
    const validPayloads = payloads
      .filter((payload) => validUserIds.includes(payload._id))
      .sort((a, b) => (a._id > b._id ? 1 : -1));
    const subjectIds = validPayloads.map(({ subject_id }) => subject_id);
    // this are the valid subjects
    const subjects = await this.subjectService.find(
      {},
      { where: { _id: In(Array.from(new Set(subjectIds))) } }
    );
    const entityPayload: DeepPartial<TeachersToSectionsToGrades>[] = [];

    for (const user of sortedValidUsers) {
      const subjectId = validPayloads.find(
        ({ _id: user_id }) => user_id === user._id
      )?.subject_id;
      const subject = subjects.find(({ _id }) => _id === subjectId);
      if (!subject) {
        errors.push({ user: user._id, message: `invalid subject_id` });
        continue;
      }
      entityPayload.push({ grade, section, user, subject });
    }

    // tsg = Teacher Section Grade (subject)
    const tsg = (await this.create(entityPayload)).map(({ user, ...rest }) => ({
      ...rest,
      user: { ...user, school: undefined },
    }));

    return {
      user: tsg,
      error: Object.entries(groupBy(errors, "user")).map(([key, val]) => ({
        user: key,
        message: val.map(({ message }) => message),
      })),
    };
  }

  //!! this method is incomplete & only for working states it was created
  //!! a lot of work need to get done here like (removing classes,
  //!! updating class schedules, exam reconfiguring etc...)
  async removeTeacher(
    { subject, user }: { user: string | User; subject: string | Subject },
    section: string | Section
  ) {
    if (typeof user === "string")
      user = await this.userService.findOne({ _id: user });
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
