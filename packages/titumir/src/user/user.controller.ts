import { Controller, Get, Logger, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { INVITATION_OR_JOIN_TYPE, USER_ROLE } from "@schoolacious/types";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { InvitationJoinService } from "../invitation-join/invitation-join.service";
import { UserService } from "./user.service";
import { Throttle } from "@nestjs/throttler";
import { StudentSectionGradeService } from "../student-section-grade/student-section-grade.service";
import { TeacherSectionGradeService } from "../teacher-section-grade/teacher-section-grade.service";
import StudentsToSectionsToGrades from "../database/entity/students_sections_grades.entity";
import TeachersToSectionsToGrades from "../database/entity/teachers_sections_grades.entity";
import { lightFormat, addMinutes, parse } from "date-fns";
import Class from "../database/entity/classes.entity";

interface GetUserResponse extends User {
    ssg?: Pick<StudentsToSectionsToGrades, "grade" | "section">;
    tsg?: Pick<TeachersToSectionsToGrades, "grade" | "section" | "subject">[];
}

@Controller("user")
@ApiBearerAuth()
export class UserController {
    logger = new Logger(UserController.name);
    constructor(
        private readonly invitationJoinService: InvitationJoinService,
        private readonly userService: UserService,
        private readonly ssgService: StudentSectionGradeService,
        private readonly tsgService: TeacherSectionGradeService,
    ) {}

    @Get("me")
    @ApiQuery({ name: "grades", type: Boolean, required: false })
    @ApiQuery({ name: "sections", type: Boolean, required: false })
    @ApiUnauthorizedResponse()
    async echoMe(
        @CurrentUser() user: User,
        @Query("grades") grades: string | boolean = "true",
        @Query("sections") sections: string | boolean = "true",
    ): Promise<GetUserResponse> {
        try {
            grades = grades === "true";
            sections = sections === "true";

            if (user.role === USER_ROLE.student && (grades || sections)) {
                const ssg = await this.ssgService.findOne(
                    { user },
                    {
                        relations: [grades && "grade", sections && "section"].filter(
                            Boolean,
                        ) as string[],
                    },
                );

                return { ...user, ssg: { grade: ssg.grade, section: ssg.section } };
            } else if (user.role !== USER_ROLE.student && (grades || sections)) {
                const tsg = await this.tsgService.find(
                    { user },
                    {
                        relations: [
                            "subject",
                            grades && "grade",
                            sections && "section",
                        ].filter(Boolean) as string[],
                    },
                );

                return {
                    ...user,
                    tsg: tsg.map(({ section, subject, grade }) => ({
                        grade,
                        section,
                        subject,
                    })),
                };
            }
            return user;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get("query")
    @Throttle(60, 60)
    @ApiUnauthorizedResponse()
    @ApiQuery({ name: "school_id", required: false })
    @ApiQuery({ name: "role", required: false })
    async queryUser(
        @Query("q") query: string,
        @Query("school_id") school_id?: string,
        @Query("role") role?: string,
    ) {
        try {
            const roles = role?.split(":");
            const users = await this.userService
                .queryBuilder("user")
                .select()
                .where("user.query_common @@ to_tsquery(:query)", {
                    query: `'${query}':*`,
                })
                .andWhere(
                    school_id ? "user.school = :school_id" : "user.school IS NULL",
                    school_id ? { school_id: school_id } : undefined,
                )
                .andWhere(
                    roles ? "user.role In(:...roles)" : "user.role IS NULL",
                    roles ? { roles } : undefined,
                )
                .getMany();
            return users;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get("invitations")
    @ApiUnauthorizedResponse()
    async getInvitations(@CurrentUser() user: User) {
        try {
            return this.invitationJoinService.getUserInvitationsJoin({
                _id: user._id,
                type: INVITATION_OR_JOIN_TYPE.invitation,
            });
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }
    @Get("join-requests")
    @ApiUnauthorizedResponse()
    async getJoinRequests(@CurrentUser() user: User) {
        try {
            return this.invitationJoinService.getUserInvitationsJoin({
                _id: user._id,
                type: INVITATION_OR_JOIN_TYPE.join,
            });
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get("upcoming-classes")
    @ApiQuery({ required: false, name: "diff" })
    @ApiQuery({ required: false, name: "day" })
    @ApiQuery({ required: false, name: "current-time" })
    async listUpcomingClasses(
        @CurrentUser() user: User,
        @Query("diff") diff = 120, //2hours
        @Query("current-time") from?: string,
        @Query("day") day?: number,
    ): Promise<Class[]> {
        try {
            const date = new Date();
            const parsedFrom = from && parse(from, "HH:mm:ss", date);
            const currentTime = lightFormat(parsedFrom || date, "HH:mm:ss");
            const time = lightFormat(addMinutes(date, diff), "HH:mm:ss");
            const classes = await this.userService.getUpcomingClasses(
                user,
                day ?? date.getDay(),
                currentTime,
                time,
            );
            return classes;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
