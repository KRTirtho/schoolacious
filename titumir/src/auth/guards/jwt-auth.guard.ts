import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { FindConditions } from "typeorm";
import Grade from "../../database/entity/grades.entity";
import User, { USER_ROLE } from "../../database/entity/users.entity";
import { EXTEND_USER_RELATION_KEY } from "../../decorator/extend-user-relation.decorator";
import { VERIFY_GRADE_KEY } from "../../decorator/verify-grade.decorator";
import { VERIFY_SCHOOL_KEY } from "../../decorator/verify-school.decorator";
import { GradeService } from "../../grade/grade.service";
import { UserSectionGradeService } from "../../section/user-section-grade.service";
import { UserService } from "../../user/user.service";
import {
  isAdministrative,
  isGradeAdministrative,
} from "../../utils/helper-functions.util";

export const IS_PUBLIC_KEY = "isPublic";

type RequestWithParams = Request<{
  school?: string;
  grade?: number;
}>;

@Injectable()
export default class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly gradeService: GradeService,
    private readonly usgService: UserSectionGradeService
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithParams>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const verifySchool = this.reflector.getAllAndOverride<boolean>(
      VERIFY_SCHOOL_KEY,
      [context.getHandler(), context.getClass()]
    );
    // this used to increase the relationship of user incase extra
    // relational data is needed
    const extendUserRelations = this.reflector.getAllAndOverride<string[]>(
      EXTEND_USER_RELATION_KEY,
      [context.getHandler(), context.getClass()]
    );
    const verifyGrade = this.reflector.getAllAndOverride<boolean>(
      VERIFY_GRADE_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (isPublic) {
      return true;
    }
    const superActivate: boolean = (await super.canActivate(
      context
    )) as boolean;

    const roles = this.reflector.get<string[]>(
      "roles",
      context.getHandler()
    ) as USER_ROLE[];

    const user = request.user as User;

    if (extendUserRelations) {
      request.user = await this.userService.findOne(
        { _id: user._id },
        {
          relations: ["school", ...extendUserRelations],
        }
      );
    }

    if (verifySchool && superActivate) {
      const isSameSchool = user?.school?.short_name === request.params.school;
      // verifying grade for current user
      if (
        verifyGrade &&
        isSameSchool &&
        !roles?.includes(USER_ROLE.gradeModerator) &&
        !roles?.includes(USER_ROLE.gradeExaminer)
      ) {
        // admin/co-admin has all the access to any grade
        if (isAdministrative(user.role)) {
          await this.getAndAssignGradeService(request);
          return true;
        }
        return await this.getAndAssignUsgService(request);
      } else if (
        verifyGrade &&
        isSameSchool &&
        roles &&
        (roles.includes(USER_ROLE.gradeModerator) ||
          roles.includes(USER_ROLE.gradeExaminer))
      ) {
        // can't let in any user without grade-administrative accounts
        if (!isGradeAdministrative(user.role)) {
          return false;
        } else if ([USER_ROLE.admin, USER_ROLE.coAdmin].includes(user.role)) {
          await this.getAndAssignGradeService(request);
          return true;
        }
        return await this.getAndAssignGradeService(request, {
          [user.role === USER_ROLE.gradeExaminer
            ? "examiner"
            : "moderator"]: user,
        });
      }
      return isSameSchool;
    }
    return superActivate;
  }

  private async getAndAssignUsgService(
    request: RequestWithParams
  ): Promise<boolean> {
    const user = request.user as User;
    const usg = await this.usgService.findOneUnsafe(
      {
        user,
        grade: { standard: request.params?.grade },
      },
      { relations: ["grade"] }
    );

    (request.user as User).school.grades = [
      ...(user?.school?.grades ?? []),
      usg?.grade,
    ];
    return !!usg;
  }

  private async getAndAssignGradeService(
    request: RequestWithParams,
    extra?: FindConditions<Grade>
  ): Promise<boolean> {
    const user = request.user as User;
    const grade = await this.gradeService.findOneUnsafe({
      ...extra,
      standard: request.params?.grade,
    });
    (request.user as User).school.grades = [
      ...(user?.school?.grades ?? []),
      grade,
    ];
    return !!grade;
  }
}
