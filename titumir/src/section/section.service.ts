import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService, {
  PartialKey,
} from "../database/abstracts/entity-service.abstract";
import Grade from "../database/entity/grades.entity";
import School from "../database/entity/schools.entity";
import Section from "../database/entity/sections.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { GradeService } from "../grade/grade.service";
import { SchoolService } from "../school/school.service";
import { UserService } from "../user/user.service";
import { StudentSectionGradeService } from "./student-section-grade.service";
import { TeacherSectionGradeService } from "./teacher-section-grade.service";

type CreateSection = PartialKey<Section, "_id">;

interface AssignClassTeacher {
  grade: Grade;
  user_id: string;
  school: School;
  section: string;
}

@Injectable()
export class SectionService extends BasicEntityService<Section, CreateSection> {
  constructor(
    @InjectRepository(Section)
    sectionRepo: Repository<Section>,
    private readonly userService: UserService,
    private schoolService: SchoolService,
    private gradeService: GradeService,
    // SG = SectionGrade
    private studentSGService: StudentSectionGradeService,
    private teacherSGService: TeacherSectionGradeService
  ) {
    super(sectionRepo);
  }

  async createSection(payload: CreateSection[]): Promise<Section[]> {
    return await this.create(payload);
  }

  async assignClassTeacher({
    grade,
    user_id,
    school,
    section: name,
  }: AssignClassTeacher) {
    const user = await this.userService.findOne(
      { _id: user_id },
      { relations: ["school"] }
    );
    if (user?.school?._id !== school._id)
      throw new BadRequestException("user doesn't belong to the school");

    const section = await this.findOne(
      { name, grade },
      { relations: ["class_teacher"] }
    );

    // removing the user from previous positions if below roles satisfies
    switch (user.role) {
      case USER_ROLE.coAdmin:
        await this.schoolService.removeCoAdmin(user, school, false);
        break;
      case USER_ROLE.gradeExaminer:
        await this.gradeService.removeRole(
          user,
          USER_ROLE.gradeExaminer,
          false
        );
      case USER_ROLE.gradeModerator:
        await this.gradeService.removeRole(
          user,
          USER_ROLE.gradeModerator,
          false
        );
        break;
      case USER_ROLE.classTeacher:
        if (section?.class_teacher?._id === user._id)
          throw new NotAcceptableException(
            "cannot assign same class_teacher twice"
          );
        await this.removeClassTeacher(user, false);
        break;
    }
    Object.assign(section, { class_teacher: { ...user, school: undefined } });
    user.role = USER_ROLE.classTeacher;
    const [updatedSection] = await Promise.all([
      this.save(section),
      this.userService.save(user),
    ]);
    return updatedSection;
  }

  //!! this method isn't complete yet, because class_teachers can also
  //!! register classes thus those classes need to get cancelled too
  //!! also `UserSectionGrade` entity needs to get updated too
  async removeClassTeacher(user: string | User, updateUser = true) {
    if (typeof user === "string") {
      user = await this.userService.findOne(
        { _id: user },
        { relations: ["school"] }
      );
    }
    if (user.role !== USER_ROLE.classTeacher)
      throw new BadRequestException("user isn't class_teacher");

    const section = await this.findOne({ class_teacher: user });
    if (updateUser) {
      user.role = USER_ROLE.teacher;
      await this.userService.save(user);
    }
    section.class_teacher = undefined;
    return await this.save(section);
  }
}
