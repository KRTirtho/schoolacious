import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import Section from "../database/entity/sections.entity";
import { USER_ROLE } from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifyGrade } from "../decorator/verify-grade.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import { VerifiedGradeUser } from "../grade/grade.controller";
import AssignClassTeacherDTO from "./dto/assign-class-teacher.dto";
import TeacherStudentDTO from "./dto/teacher-student.dto";
import CreateSectionDTO from "./dto/create-section.dto";
import { SectionService } from "./section.service";
import { StudentSectionGradeService } from "./student-section-grade.service";

@Controller("/school/:school/grade/:grade/section")
export class SectionController {
  logger: Logger = new Logger(SectionController.name);
  constructor(
    private sectionService: SectionService,
    private studentSGService: StudentSectionGradeService
  ) {}

  @Get()
  @VerifySchool()
  async getSections(
    @Param("grade", new ParseIntPipe()) standard: number
  ): Promise<Omit<Section, "grade">[]> {
    try {
      const sections = await this.sectionService
        .queryBuilder("section")
        .leftJoinAndSelect(
          "section.grade",
          "grade",
          "grade.standard = :standard",
          { standard }
        )
        .getMany();
      return sections.map((section) => ({ ...section, grade: undefined }));
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Get(":section")
  @VerifySchool()
  async getMonoSection(
    @Param("grade", new ParseIntPipe()) standard: number,
    @Param("section") name: string
  ) {
    try {
      const section = await this.sectionService
        .queryBuilder("section")
        .where("section.name = :name", { name })
        .leftJoinAndSelect(
          "section.grade",
          "grade",
          "grade.standard = :standard",
          { standard }
        )
        .leftJoinAndSelect("section.classes", "classes")
        .leftJoinAndSelect("section.class_teacher", "class_teacher")
        .getOne();
      return { ...section, grade: undefined };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Post()
  @VerifyGrade()
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin, USER_ROLE.gradeModerator)
  async createSection(
    @Body(new ParseArrayPipe({ items: CreateSectionDTO }))
    body: CreateSectionDTO[],
    @CurrentUser() user: VerifiedGradeUser
  ) {
    try {
      return (
        await this.sectionService.createSection(
          body.map(({ name }) => ({ name, grade: user.grade }))
        )
      ).map((section) => ({ ...section, grade: undefined }));
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Put(":section/class-teacher")
  @VerifyGrade()
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin, USER_ROLE.gradeModerator)
  async assignClassTeacher(
    @Param("section") section: string,
    @CurrentUser() user: VerifiedGradeUser,
    @Body() { user_id }: AssignClassTeacherDTO
  ) {
    try {
      return await this.sectionService.assignClassTeacher({
        grade: user.grade,
        user_id,
        school: user.school,
        section,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Put(":section/students")
  @VerifyGrade()
  @Roles(
    USER_ROLE.admin,
    USER_ROLE.coAdmin,
    USER_ROLE.gradeModerator,
    USER_ROLE.classTeacher
  )
  async addStudents(
    @CurrentUser() user: VerifiedGradeUser,
    @Body(new ParseArrayPipe({ items: TeacherStudentDTO }))
    body: TeacherStudentDTO[],
    @Param("section") name: string
  ) {
    try {
      const sections = await this.sectionService.findOne({
        grade: user.grade,
        name,
      });
      return await this.studentSGService.addStudents(
        body.map(({ _id }) => _id),
        user.school,
        user.grade,
        sections
      );
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Delete(":section/students")
  @VerifyGrade()
  @Roles(
    USER_ROLE.admin,
    USER_ROLE.coAdmin,
    USER_ROLE.gradeModerator,
    USER_ROLE.classTeacher
  )
  async removeStudent(@Body() body: TeacherStudentDTO) {
    try {
      return { message: await this.studentSGService.removeStudent(body._id) };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
