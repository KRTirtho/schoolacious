import {
    Body,
    Controller,
    Headers,
    Post,
    UseGuards,
    NotAcceptableException,
    UnauthorizedException,
    Res,
    Get,
    Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
    AUTHORIZATION_COOKIE_OPTS,
    CONST_JWT_ACCESS_TOKEN_COOKIE,
    CONST_REFRESH_TOKEN_HEADER,
} from "../../config";
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

@Controller("auth")
export class AuthController {
    logger = new Logger(AuthController.name);
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
        
    }
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @ApiUnauthorizedResponse({ description: "Invalid credentials" })
    async login(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) res: Response,
        @Body() _?: LoginDTO,
    ): Promise<User> {
        try {
            const { access_token, refresh_token } = this.authService.createTokens(user);
            res?.setHeader(CONST_REFRESH_TOKEN_HEADER, refresh_token);
            res?.cookie(
                CONST_JWT_ACCESS_TOKEN_COOKIE,
                access_token,
                AUTHORIZATION_COOKIE_OPTS,
            );

            return user;
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }
    @Public()
    @Post("refresh")
    @ApiHeader({ name: CONST_REFRESH_TOKEN_HEADER, description: "Refresh token" })
    @ApiUnauthorizedResponse({
        description: "Invalid refresh token, refresh token not provided",
    })
    async refresh(
        @Headers() headers: Request["headers"],
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ message: string }> {
        try {
            const refreshToken = headers?.[CONST_REFRESH_TOKEN_HEADER] as string;
            if (!refreshToken) throw new NotAcceptableException("refresh token not set");
            const user = await this.authService.verify(refreshToken, ["school"]);
            const { access_token, refresh_token } = this.authService.createTokens(user);
            res?.cookie(
                CONST_JWT_ACCESS_TOKEN_COOKIE,
                access_token,
                AUTHORIZATION_COOKIE_OPTS,
            );
            res?.set(CONST_REFRESH_TOKEN_HEADER, refresh_token);
            return { message: "Refreshed access_token" };
        } catch (error: any) {
            this.logger.error(error);
            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException(error.message);
            }
            throw error;
        }
    }

    @Public()
    @Post("signup")
    async signup(
        @Body() body: SignupDTO,
        @Res({ passthrough: true }) res: Response,
    ): Promise<Omit<User, "password">> {
        try {
            const { email, role, ...user } = await this.userService.createUser(body);
            const { access_token, refresh_token } = this.authService.createTokens({
                email,
                role: role ?? null,
            });
            res?.setHeader(CONST_REFRESH_TOKEN_HEADER, refresh_token);
            res?.cookie(
                CONST_JWT_ACCESS_TOKEN_COOKIE,
                access_token,
                AUTHORIZATION_COOKIE_OPTS,
            );
            return { ...user, email, role };
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get("logout")
    async logout(@Res({ passthrough: true }) res: Response) {
        try {
            res.clearCookie(CONST_JWT_ACCESS_TOKEN_COOKIE);
            return { message: "Successfully Logged Out" };
        } catch (e: any) {
            this.logger.error(e);
            throw e;
        }
    }
}
