import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    ParseArrayPipe,
    Post,
    Put,
    ParseIntPipe,
    Inject,
    Query,
} from "@nestjs/common";
import School from "../database/entity/schools.entity";
import User from "../database/entity/users.entity";
import { USER_ROLE } from "@veschool/types";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifyGrade } from "../decorator/verify-grade.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import AssignSubjectsDTO from "./dto/assign-subject.dto";
import AssignGradeLeadsDTO from "./dto/assign-grade-leads.dto";
import CreateGradeDTO from "./dto/create-grade.dto";
import { GradeSubjectService } from "./grade-subject.service";
import { GradeService } from "./grade.service";

import { ExtendUserRelation } from "../decorator/extend-user-relation.decorator";
import Grade from "../database/entity/grades.entity";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiNotAcceptableResponse,
    ApiNotFoundResponse,
} from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

export interface VerifiedGradeUser extends User {
    school: School;
    grade: Grade;
}

@Controller("/school/:school/grade")
@ApiBearerAuth()
export class GradeController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
        private readonly gradeService: GradeService,
        private readonly gradeToSubjectService: GradeSubjectService,
    ) {
        this.logger.setContext(GradeController.name);
    }

    @Get()
    @VerifySchool()
    async getAllGradeOfSchool(
        @CurrentUser() user: User,
        @Param("school") _: string,
        @Query("extended") extendRelation?: string,
    ) {
        try {
            const gradeRelations = [
                "moderator",
                "examiner",
                "sections",
                "grades_subjects",
                "grades_subjects.subject",
                "teachersToSectionsToGrades",
                "studentsToSectionsToGrade",
                "sections.class_teacher",
            ];
            const extendedRelationArr = extendRelation?.split(",");
            const isValidExtendedRelation = extendedRelationArr?.every((relation) =>
                gradeRelations.includes(relation),
            );

            const grades = await this.gradeService.find(
                { school: user.school! },
                {
                    relations:
                        extendedRelationArr && isValidExtendedRelation
                            ? extendedRelationArr
                            : [],
                },
            );
            return grades;
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Get(":grade")
    @VerifySchool()
    @ApiNotFoundResponse({ description: "invalid grade" })
    async getMonoGrade(
        @CurrentUser("school") school: School,
        @Param("grade") standard: number,
        @Param("school") _: string,
    ) {
        try {
            const grade = await this.gradeService.findOne(
                { school, standard },
                {
                    relations: [
                        "grades_subjects",
                        "grades_subjects.subject",
                        "moderator",
                        "examiner",
                    ],
                },
            );
            return {
                ...grade,
                grades_subjects: undefined,
                subjects: grade.grades_subjects?.map((gs) => gs.subject),
            };
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Post()
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    @ApiBody({ type: CreateGradeDTO })
    async createGrade(
        @Body() { moderator, examiner, standard }: CreateGradeDTO,
        @CurrentUser() user: User,
        @Param("school") _: string,
    ) {
        try {
            const grade = await this.gradeService.create({
                standard,
                school: user.school!,
            });
            // assigning moderator/examiner to grade's
            const [gradeModerator, gradeExaminer] = await Promise.all([
                moderator
                    ? this.gradeService.assignRole({
                          email: moderator,
                          role: USER_ROLE.gradeModerator,
                          school: user.school!,
                          standard,
                      })
                    : undefined,
                examiner
                    ? this.gradeService.assignRole({
                          email: examiner,
                          role: USER_ROLE.gradeExaminer,
                          school: user.school!,
                          standard,
                      })
                    : undefined,
            ]);
            grade.moderator = gradeModerator?.moderator;
            grade.examiner = gradeExaminer?.examiner;
            return grade;
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Post(":grade/subject")
    @VerifyGrade()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin, USER_ROLE.gradeModerator)
    @ApiBody({ type: [AssignSubjectsDTO] })
    async assignSubjects(
        @Body(new ParseArrayPipe({ items: AssignSubjectsDTO }))
        body: AssignSubjectsDTO[],
        @CurrentUser() user: VerifiedGradeUser,
        @Param("grade") _?: number,
        @Param("school") __?: string,
    ) {
        try {
            const gradesToSubjects = await this.gradeToSubjectService.create(
                body.map(({ subject_id, mark }) => ({
                    subject: { _id: subject_id },
                    grade: user.grade,
                    mark,
                })),
            );
            return gradesToSubjects;
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Put(":grade/assign-moderator")
    @VerifySchool()
    @ExtendUserRelation("school.coAdmin1", "school.coAdmin2")
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    async assignModerator(
        @Param("grade") standard: number,
        @CurrentUser("school") school: School,
        @Body() { email }: AssignGradeLeadsDTO,
        @Param("school") _: string,
    ) {
        try {
            return await this.gradeService.assignRole({
                email,
                role: USER_ROLE.gradeModerator,
                school,
                standard,
            });
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }
    @Put(":grade/assign-examiner")
    @VerifySchool()
    @ExtendUserRelation("school.coAdmin1", "school.coAdmin2")
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    @ApiBadRequestResponse({
        description: "user not of school, duplicate role assign, user not a co-admin",
    })
    @ApiNotFoundResponse({ description: "user not found" })
    @ApiNotAcceptableResponse({ description: "school has no co-admin" })
    async assignExaminer(
        @Param("grade", new ParseIntPipe()) standard: number,
        @CurrentUser("school") school: School,
        @Body() { email }: AssignGradeLeadsDTO,
        @Param("school") _: string,
    ) {
        try {
            return await this.gradeService.assignRole({
                email,
                role: USER_ROLE.gradeExaminer,
                school,
                standard,
            });
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }
}
