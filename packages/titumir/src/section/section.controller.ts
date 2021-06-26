import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Inject,
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
} from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { FindConditions } from "typeorm";
import Section from "../database/entity/sections.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
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
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
        private sectionService: SectionService,
        private studentSGService: StudentSectionGradeService,
        private teacherSGService: TeacherSectionGradeService,
    ) {
        this.logger.setContext(SectionController.name);
    }

    @Get()
    @VerifySchool()
    async getSections(
        @Param("grade", new ParseIntPipe()) standard: number,
        @Param("school") _?: number,
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
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Get(":section")
    @VerifySchool()
    @ApiNotFoundResponse({ description: "invalid section" })
    async getMonoSection(
        @Param("grade", new ParseIntPipe()) standard: number,
        @Param("section") name: string,
        @Param("school") _?: number,
    ) {
        try {
            const section = await this.sectionService
                .queryBuilder("section")
                .where("section.name = :name", { name })
                .leftJoinAndSelect(
                    "section.grade",
                    "grade",
                    "grade.standard = :standard",
                    { standard },
                )
                .leftJoinAndSelect("section.classes", "classes")
                .leftJoinAndSelect("section.class_teacher", "class_teacher")
                .getOneOrFail();
            return { ...section, grade: undefined };
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Post()
    @VerifyGrade()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin, USER_ROLE.gradeModerator)
    @ApiBody({ type: [CreateSectionDTO] })
    async createSection(
        @Body(new ParseArrayPipe({ items: CreateSectionDTO }))
        body: CreateSectionDTO[],
        @CurrentUser() user: VerifiedGradeUser,
        @Param("school") _?: number,
        @Param("grade") __?: number,
    ) {
        try {
            return (
                await this.sectionService.createSection(
                    body.map(({ name }) => ({ name, grade: user.grade })),
                )
            ).map((section) => ({ ...section, grade: undefined }));
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
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
    async assignClassTeacher(
        @Param("section") section: string,
        @CurrentUser() user: VerifiedGradeUser,
        @Body() { user_id }: AssignClassTeacherDTO,
        @Param("school") _?: number,
        @Param("grade") __?: number,
    ) {
        try {
            return await this.sectionService.assignClassTeacher({
                grade: user.grade,
                user_id,
                school: user.school,
                section,
            });
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
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
    async addStudents(
        @CurrentUser() user: VerifiedGradeUser,
        @Body(new ParseArrayPipe({ items: StudentDTO }))
        body: StudentDTO[],
        @Param("section") name: string,
        @Param("school") _?: number,
        @Param("grade") __?: number,
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
            this.logger.error(error?.message ?? "");
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
    async removeStudent(
        @Body() body: StudentDTO,
        @CurrentUser() user: VerifiedGradeUser,
        @Param("section") name: string,
        @Param("school") _?: number,
        @Param("grade") __?: number,
    ) {
        try {
            await verifyClassTeacher(
                user,
                { grade: user.grade, name },
                this.sectionService,
            );
            return await this.studentSGService.removeStudent(body._id);
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Put(":section/teachers")
    @VerifyGrade()
    @Roles(
        USER_ROLE.admin,
        USER_ROLE.coAdmin,
        USER_ROLE.gradeModerator,
        USER_ROLE.classTeacher,
    )
    @ApiBody({ type: [TeacherDTO] })
    @ApiForbiddenResponse({ description: "not class_teacher of section" })
    async addTeachers(
        @Body(new ParseArrayPipe({ items: TeacherDTO })) body: TeacherDTO[],
        @CurrentUser() user: VerifiedGradeUser,
        @Param("section") name: string,
        @Param("school") _?: number,
        @Param("grade") __?: number,
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
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Delete(":section/teachers")
    @VerifyGrade()
    @Roles(
        USER_ROLE.admin,
        USER_ROLE.coAdmin,
        USER_ROLE.gradeModerator,
        USER_ROLE.classTeacher,
    )
    @ApiForbiddenResponse({ description: "not class_teacher of section" })
    @ApiNotFoundResponse({ description: "user | section | subject not found" })
    async remove(
        @Body() body: TeacherDTO,
        @Param("section") name: string,
        @CurrentUser() user: VerifiedGradeUser,
        @Param("school") _?: number,
        @Param("grade") __?: number,
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
                    user: body._id,
                },
                section,
            );
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }
}
