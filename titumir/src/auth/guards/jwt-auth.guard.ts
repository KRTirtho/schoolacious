import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import User, { USER_ROLE } from "../../database/entity/users.entity";
import { EXTEND_USER_RELATION_KEY } from "../../decorator/extend-user-relation.decorator";
import { VERIFY_GRADE_KEY } from "../../decorator/verify-grade.decorator";
import { VERIFY_SCHOOL_KEY } from "../../decorator/verify-school.decorator";
import { GradeService } from "../../grade/grade.service";
import { UserService } from "../../user/user.service";

export const IS_PUBLIC_KEY = "isPublic";

@Injectable()
export default class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly gradeService: GradeService
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request<{ school?: string; grade?: number }>>();
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

    if (extendUserRelations) {
      request.user = await this.userService.findOne(
        { _id: (request.user as User)._id },
        {
          relations: ["school", ...extendUserRelations],
        }
      );
    }

    if (verifySchool && superActivate) {
      const isSameSchool =
        (request.user as User).school.short_name === request.params.school;
      // TODO: Grade verification has to be more advanced & it'll based be
      // TODO: on Sections
      // school has to be same for user to verify grade
      // if (verifyGrade) {
      //   const grade = await this.gradeService.findOne({
      //     school: (request.user as User).school,
      //     standard: request.params.grade,
      //   });

      //   return (
      //     ((request.user as User).role in
      //       [USER_ROLE.admin, USER_ROLE.coAdmin] &&
      //       isSameSchool) ||
      //     (isSameSchool && !!grade)
      //   );
      // }
      return isSameSchool;
    }
    return superActivate;
  }
}
