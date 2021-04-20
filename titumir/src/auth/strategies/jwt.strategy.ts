import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
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
    const user = await this.userService.findUser({ email });
    if (!user) throw new UnauthorizedException("Invalid user");
    return user;
  }
}
