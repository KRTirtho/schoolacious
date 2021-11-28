import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Logger,
    Param,
    ParseArrayPipe,
    ParseIntPipe,
    Post,
    Put,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiNotAcceptableResponse,
    ApiNotFoundResponse,
    ApiParam,
} from "@nestjs/swagger";
import { FindConditions } from "typeorm";
import Section from "../database/entity/sections.entity";
import User from "../database/entity/users.entity";
import { USER_ROLE } from "@veschool/types";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifyGrade } from "../decorator/verify-grade.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import { VerifiedGradeUser } from "../grade/grade.controller";
import AssignClassTeacherDTO from "./dto/assign-class-teacher.dto";
import CreateSectionDTO from "./dto/create-section.dto";
import StudentDTO, { TeacherDTO } from "./dto/teacher-student.dto";
import { SectionService } from "./section.service";
import { StudentSectionGradeService } from "./student-section-grade.service";
import { TeacherSectionGradeService } from "./teacher-section-grade.service";
import Subject from "../database/entity/subjects.entity";
import TeachersToSectionsToGrades from "../database/entity/teachers_sections_grades.entity";

async function verifyClassTeacher(
    user: User,
    conditions: FindConditions<Section>,
    sectionService: SectionService,
) {
    const section = await sectionService.findOne(conditions, {
        relations: ["class_teacher"],
    });
    if (user.role === USER_ROLE.classTeacher && section.class_teacher?._id !== user._id)
        throw new ForbiddenException(
            `user isn't the class_teacher of section ${section.name}`,
        );
    return section;
}

@Controller("/school/:school/grade/:grade/section")
@ApiBearerAuth()
export class SectionController {
    logger = new Logger(SectionController.name);
    constructor(
        private sectionService: SectionService,
        private studentSGService: StudentSectionGradeService,
        private teacherSGService: TeacherSectionGradeService,
    ) {}

    @Get()
    @VerifySchool()
    @ApiParam({ name: "school", type: String })
    async getSections(
        @Param("grade", new ParseIntPipe()) standard: number,
    ): Promise<Omit<Section, "grade">[]> {
        try {
            const sections = await this.sectionService
                .queryBuilder("section")
                .leftJoinAndSelect(
                    "section.grade",
                    "grade",
                    "grade.standard = :standard",
                    { standard },
                )
                .getMany();
            return sections.map((section) => ({ ...section, grade: undefined }));
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get(":section")
    @VerifySchool()
    @ApiNotFoundResponse({ description: "invalid section" })
    @ApiParam({ name: "school", type: String })
    async getMonoSection(
        @Param("grade", new ParseIntPipe()) standard: number,
        @Param("section") name: string,
    ): Promise<
        Omit<Section, "grade"> & {
            grade: undefined;
            subjects: { subject: Subject; teacher: User | null }[] | null;
        }
    > {
        try {
            const section = await this.sectionService.findOne(
                { name, grade: { standard } },
                {
                    relations: [
                        "grade",
                        "grade.grades_subjects",
                        "grade.grades_subjects.subject",
                        "class_teacher",
                        "teachersToSectionsToGrades",
                        "teachersToSectionsToGrades.subject",
                        "studentsToSectionsToGrade",
                        "teachersToSectionsToGrades.user",
                        "studentsToSectionsToGrade.user",
                    ],
                },
            );

            // finding the associated teacher with the subject & returning
            const subjects =
                section.grade.grades_subjects?.map(({ subject }) => {
                    const tsg = section.teachersToSectionsToGrades?.find(
                        (tsg) => subject._id === tsg.subject._id,
                    );
                    return { subject, teacher: tsg?.user ?? null };
                }) ?? null;
            return {
                ...section,
                subjects,
                grade: undefined,
            };
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Post()
    @VerifyGrade()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin, USER_ROLE.gradeModerator)
    @ApiParam({ name: "school", type: String })
    @ApiParam({ name: "grade", type: String })
    async createSection(
        @Body()
        body: CreateSectionDTO,
        @CurrentUser() user: VerifiedGradeUser,
    ) {
        try {
            const section = await this.sectionService.createSection({
                grade: user.grade,
                name: body.name,
            });
            const sectionWithClassTeacher = await this.sectionService.assignClassTeacher({
                section: section.name,
                grade: user.grade,
                school: user.school,
                email: body.class_teacher,
            });
            return sectionWithClassTeacher;
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Put(":section/class-teacher")
    @VerifyGrade()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin, USER_ROLE.gradeModerator)
    @ApiBadRequestResponse({
        description: "non-belonging school, user isn't class_teacher",
    })
    @ApiNotFoundResponse({ description: "user not found" })
    @ApiNotAcceptableResponse({ description: "same class_teacher twice" })
    @ApiParam({ name: "school", type: String })
    @ApiParam({ name: "grade", type: String })
    async assignClassTeacher(
        @Param("section") section: string,
        @CurrentUser() user: VerifiedGradeUser,
        @Body() { email }: AssignClassTeacherDTO,
    ) {
        try {
            return await this.sectionService.assignClassTeacher({
                grade: user.grade,
                email,
                school: user.school,
                section,
            });
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Put(":section/students")
    @VerifyGrade()
    @Roles(
        USER_ROLE.admin,
        USER_ROLE.coAdmin,
        USER_ROLE.gradeModerator,
        USER_ROLE.classTeacher,
    )
    @ApiBody({ type: [StudentDTO] })
    @ApiForbiddenResponse({ description: "not class_teacher of section" })
    @ApiParam({ name: "school", type: String })
    @ApiParam({ name: "grade", type: String })
    async addStudents(
        @CurrentUser() user: VerifiedGradeUser,
        @Body(new ParseArrayPipe({ items: StudentDTO }))
        body: StudentDTO[],
        @Param("section") name: string,
    ) {
        try {
            const sections = await verifyClassTeacher(
                user,
                { grade: user.grade, name },
                this.sectionService,
            );
            return await this.studentSGService.addStudents(
                body.map(({ _id }) => _id),
                user.school,
                user.grade,
                sections,
            );
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Delete(":section/students")
    @VerifyGrade()
    @Roles(
        USER_ROLE.admin,
        USER_ROLE.coAdmin,
        USER_ROLE.gradeModerator,
        USER_ROLE.classTeacher,
    )
    @ApiForbiddenResponse({ description: "not class_teacher of section" })
    @ApiBadRequestResponse({ description: "user ain't student" })
    @ApiParam({ name: "school", type: String })
    @ApiParam({ name: "grade", type: String })
    async removeStudent(
        @Body() body: StudentDTO,
        @CurrentUser() user: VerifiedGradeUser,
        @Param("section") name: string,
    ) {
        try {
            await verifyClassTeacher(
                user,
                { grade: user.grade, name },
                this.sectionService,
            );
            return await this.studentSGService.removeStudent(body._id);
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get(":section/teachers")
    @ApiParam({ name: "school", type: String })
    async getTeachers(
        @Param("grade", ParseIntPipe) standard: number,
        @Param("section") name: string,
    ): Promise<Omit<TeachersToSectionsToGrades, "section" | "grade">[]> {
        try {
            const teachers = await this.teacherSGService.find(
                {},
                {
                    where: { grade: { standard }, section: { name } },
                    relations: ["grade", "section", "user", "subject"],
                },
            );
            return teachers.map((teacher) => ({
                ...teacher,
                grade: undefined,
                section: undefined,
            }));
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Put(":section/teacher")
    @VerifyGrade()
    @Roles(
        USER_ROLE.admin,
        USER_ROLE.coAdmin,
        USER_ROLE.gradeModerator,
        USER_ROLE.classTeacher,
    )
    @ApiForbiddenResponse({ description: "not class_teacher of section" })
    @ApiParam({ name: "school", type: String })
    @ApiParam({ name: "grade", type: String })
    async addTeacher(
        @Body() body: TeacherDTO,
        @CurrentUser() user: VerifiedGradeUser,
        @Param("section") name: string,
    ) {
        try {
            const section = await verifyClassTeacher(
                user,
                { grade: user.grade, name },
                this.sectionService,
            );
            return await this.teacherSGService.addTeachers(
                body,
                user.school,
                user.grade,
                section,
            );
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Delete(":section/teacher")
    @VerifyGrade()
    @Roles(
        USER_ROLE.admin,
        USER_ROLE.coAdmin,
        USER_ROLE.gradeModerator,
        USER_ROLE.classTeacher,
    )
    @ApiForbiddenResponse({ description: "not class_teacher of section" })
    @ApiNotFoundResponse({ description: "user | section | subject not found" })
    @ApiParam({ name: "school", type: String })
    @ApiParam({ name: "grade", type: String })
    async remove(
        @Body() body: TeacherDTO,
        @Param("section") name: string,
        @CurrentUser() user: VerifiedGradeUser,
    ) {
        try {
            const section = await verifyClassTeacher(
                user,
                { grade: user.grade, name },
                this.sectionService,
            );
            return await this.teacherSGService.removeTeacher(
                {
                    subject: body.subject_id,
                    user: body.email,
                },
                section,
            );
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }
}
