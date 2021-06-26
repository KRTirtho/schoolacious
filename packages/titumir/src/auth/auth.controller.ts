import {
    Body,
    Controller,
    Headers,
    Logger,
    Post,
    Req,
    UseGuards,
    NotAcceptableException,
    UnauthorizedException,
    Inject,
} from "@nestjs/common";
import { Request } from "express";
import { CONST_ACCESS_TOKEN_HEADER, CONST_REFRESH_TOKEN_HEADER } from "../../config";
import { Public } from "../decorator/public.decorator";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import SignupDTO from "./dto/signup.dto";
import LocalAuthGuard from "./guards/local-auth.jwt";
import { JsonWebTokenError } from "jsonwebtoken";
import { CurrentUser } from "../decorator/current-user.decorator";
import User from "../database/entity/users.entity";
import LoginDTO from "./dto/login.dto";
import { ApiHeader, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Controller("auth")
export class AuthController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
        this.logger.setContext(AuthController.name);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @ApiUnauthorizedResponse({ description: "Invalid credentials" })
    async login(
        @CurrentUser() user: User,
        @Req() { res }: Request,
        @Body() _?: LoginDTO,
    ): Promise<User> {
        try {
            const { access_token, refresh_token } = this.authService.createTokens(user);
            res?.setHeader(CONST_ACCESS_TOKEN_HEADER, access_token);
            res?.setHeader(CONST_REFRESH_TOKEN_HEADER, refresh_token);
            return user;
        } catch (error: any) {
            this.logger.error(error?.message);
            throw error;
        }
    }
    @Public()
    @Post("refresh")
    @ApiHeader({ name: CONST_REFRESH_TOKEN_HEADER, description: "Refresh token" })
    @ApiUnauthorizedResponse({
        description: "Invalid refresh token, refresh token not provided",
    })
    async refresh(@Headers() headers: Request["headers"], @Req() { res }: Request) {
        try {
            const refreshToken = headers[CONST_REFRESH_TOKEN_HEADER] as string;
            if (!refreshToken) throw new NotAcceptableException("refresh token not set");
            const user = await this.authService.verify(refreshToken, ["school"]);
            const { access_token, refresh_token } = this.authService.createTokens(user);
            res?.set(CONST_ACCESS_TOKEN_HEADER, access_token);
            res?.set(CONST_REFRESH_TOKEN_HEADER, refresh_token);
            return { message: "Refreshed access_token", user };
        } catch (error: any) {
            this.logger.error(error?.message);
            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException(error.message);
            }
            throw error;
        }
    }

    @Public()
    @Post("signup")
    async signup(@Body() body: SignupDTO, @Req() { res }: Request) {
        try {
            const { email, role, ...user } = await this.userService.createUser(body);
            const { access_token, refresh_token } = this.authService.createTokens({
                email,
                role: role ?? null,
            });
            res?.setHeader(CONST_ACCESS_TOKEN_HEADER, access_token);
            res?.setHeader(CONST_REFRESH_TOKEN_HEADER, refresh_token);
            return { ...user, email, role };
        } catch (error: any) {
            this.logger.error(error?.message);
            throw error;
        }
    }
}
