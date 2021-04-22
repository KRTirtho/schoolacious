import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import User from "../../database/entity/users.entity";
import { VERIFY_SCHOOL_KEY } from "../../decorator/verify-school.decorator";

export const IS_PUBLIC_KEY = "isPublic";

@Injectable()
export default class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request<{ school: string }>>();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const verifySchool = this.reflector.getAllAndOverride<boolean>(
      VERIFY_SCHOOL_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (isPublic) {
      return true;
    }
    const superActivate: boolean = (await super.canActivate(
      context
    )) as boolean;
    if (verifySchool && superActivate) {
      return (request.user as User).school.short_name === request.params.school;
    }
    return superActivate;
  }
}
