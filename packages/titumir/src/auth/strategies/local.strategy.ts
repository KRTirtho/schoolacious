import {
    BadRequestException,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { validate as validateClass } from "class-validator";
import { plainToClass } from "class-transformer";
import LoginDTO from "../dto/login.dto";

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
    logger = new Logger(LocalStrategy.name);
    constructor(private readonly authService: AuthService) {
        super({ usernameField: "email" });
    }
    async validate(email: string, password: string) {
        try {
            const error = await validateClass(
                plainToClass(LoginDTO, { email, password }),
            );
            if (error.length > 0)
                throw new BadRequestException(
                    error.map((x) => Object.values(x.constraints ?? {})).flat(1),
                );
            const user = await this.authService.validate(email, password);

            if (!user) {
                throw new UnauthorizedException();
            }

            return user;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
