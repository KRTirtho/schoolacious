import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { QueryFailedError } from "typeorm";
import { NOT_A_SECRET } from "../../../config";
import User from "../../database/entity/users.entity";
import { UserService } from "../../user/user.service";

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: NOT_A_SECRET,
    });
  }

  async validate({ email }: Pick<User, "email" | "role">) {
    try {
      const user = await this.userService.findUser(
        { email },
        { relations: ["school"] }
      );
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError)
        throw new UnauthorizedException("invalid user");
      throw error;
    }
  }
}
