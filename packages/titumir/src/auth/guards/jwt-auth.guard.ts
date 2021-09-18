import { ExecutionContext, HttpException, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import User from "../../database/entity/users.entity";
import { USER_ROLE } from "@veschool/types";
import { EXTEND_USER_RELATION_KEY } from "../../decorator/extend-user-relation.decorator";
import { VERIFY_GRADE_KEY } from "../../decorator/verify-grade.decorator";
import { VERIFY_SCHOOL_KEY } from "../../decorator/verify-school.decorator";
import { VERIFY_SECTION_KEY } from "../../decorator/verify-section.decorator";
import { GradeService } from "../../grade/grade.service";
import { StudentSectionGradeService } from "../../section/student-section-grade.service";
import { TeacherSectionGradeService } from "../../section/teacher-section-grade.service";
import { UserService } from "../../user/user.service";
import {
    isAdministrative,
    isGradeAdministrative,
} from "../../utils/helper-functions.util";

export const IS_PUBLIC_KEY = "isPublic";

type RequestWithParams = Request<{
    school?: string;
    grade?: number;
    section?: number;
}>;

@Injectable()
export default class JwtAuthGuard extends AuthGuard("jwt") {
    logger = new Logger(JwtAuthGuard.name);
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService,
        private readonly gradeService: GradeService,
        private readonly studentSGService: StudentSectionGradeService,
        private readonly teacherSGService: TeacherSectionGradeService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest<RequestWithParams>();

            const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            const verifySchool = this.reflector.getAllAndOverride<boolean>(
                VERIFY_SCHOOL_KEY,
                [context.getHandler(), context.getClass()],
            );
            // this used to increase the relationship of user incase extra
            // relational data is needed
            const extendUserRelations = this.reflector.getAllAndOverride<string[]>(
                EXTEND_USER_RELATION_KEY,
                [context.getHandler(), context.getClass()],
            );
            const verifyGrade = this.reflector.getAllAndOverride<boolean>(
                VERIFY_GRADE_KEY,
                [context.getHandler(), context.getClass()],
            );
            const verifySection = this.reflector.getAllAndOverride<boolean>(
                VERIFY_SECTION_KEY,
                [context.getHandler(), context.getClass()],
            );
            if (isPublic) {
                return true;
            }
            const superActivate: boolean = (await super.canActivate(context)) as boolean;

            const roles = this.reflector.get<string[]>(
                "roles",
                context.getHandler(),
            ) as USER_ROLE[];

            const user = request.user as User;

            if (extendUserRelations) {
                request.user = await this.userService.findOne(
                    { _id: user._id },
                    {
                        relations: ["school", ...extendUserRelations],
                    },
                );
            }

            if (verifySchool && superActivate) {
                const isSameSchool = user?.school?.short_name === request.params.school;

                if (isSameSchool && verifyGrade) {
                    return this.verifyGrade(request, user, roles);
                }

                return isSameSchool;
            }
            return superActivate;
        } catch (error) {
            this.logger.error(error);
            if (error instanceof HttpException) throw error;
            return false;
        }
    }

    async verifyGrade(request: RequestWithParams, user: User, roles: USER_ROLE[]) {
        const leaderField =
            user.role === USER_ROLE.gradeExaminer ? "examiner" : "moderator";
        const grade = await this.gradeService.findOne(
            {
                standard: request.params.grade,
            },
            { relations: [leaderField] },
        );
        if (isAdministrative(user.role)) {
            Object.assign(request.user, { grade });
            return true;
        } else if (
            (roles.includes(USER_ROLE.gradeExaminer) ||
                roles.includes(USER_ROLE.gradeModerator)) &&
            isGradeAdministrative(user.role)
        ) {
            Object.assign(request.user, { grade });
            return grade[leaderField]?._id === user._id;
        } else {
            // for general student/teacher/class-teacher(s)
            // in here user.role can be anything because a grade-moderator
            // or grade-examiner might not belong to current grade but
            // might belong as a regular teacher. That's why except student
            // everyone here is a teacher & we've to verify that
            const serviceField =
                user.role === USER_ROLE.student ? "studentSGService" : "teacherSGService";
            const usg = await this[serviceField].findOneUnsafe({
                grade,
                user,
            });
            Object.assign(request.user, { grade });
            return !!usg;
        }
    }

    async verifySection(request: RequestWithParams, user: User, roles: USER_ROLE[]) {
        // verifying class teacher
    }
}
