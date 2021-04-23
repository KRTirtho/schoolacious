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
} from "@nestjs/common";
import { Request } from "express";
import { QueryFailedError } from "typeorm";
import {
  CONST_ACCESS_TOKEN_HEADER,
  CONST_REFRESH_TOKEN_HEADER,
} from "../../config";
import { Public } from "../decorator/public.decorator";
import { UserService } from "../user/user.service";
import { AuthService, TokenUser } from "./auth.service";
import SignupDTO from "./dto/signup.dto";
import LocalAuthGuard from "./guards/local-auth.jwt";
import { JsonWebTokenError } from "jsonwebtoken";

@Controller("auth")
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() { res, ...req }: Request) {
    try {
      const { access_token, refresh_token } = this.authService.createTokens(
        req.user as TokenUser
      );
      res.setHeader(CONST_ACCESS_TOKEN_HEADER, access_token);
      res.setHeader(CONST_REFRESH_TOKEN_HEADER, refresh_token);
      return req.user;
    } catch (error) {
      this.logger.error(error.message);
      if (error instanceof QueryFailedError) {
        throw new NotAcceptableException((error as any).detail);
      }
      return error;
    }
  }
  @Public()
  @Post("refresh")
  async refresh(@Headers() headers: Request["headers"], @Req() req: Request) {
    try {
      const refreshToken = headers[CONST_REFRESH_TOKEN_HEADER] as string;
      if (!refreshToken)
        throw new NotAcceptableException("refresh token not set");
      const isValid = await this.authService.verify(refreshToken);
      if (!isValid) throw new UnauthorizedException("invalid refresh token");
      const { access_token, refresh_token } = this.authService.createTokens(
        isValid
      );
      req.res.set(CONST_ACCESS_TOKEN_HEADER, access_token);
      req.res.set(CONST_REFRESH_TOKEN_HEADER, refresh_token);
      return { message: "Refreshed access_token" };
    } catch (error) {
      this.logger.error(error.message);
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
      const { email, role, ...user } = await this.userService.create(body);
      const { access_token, refresh_token } = this.authService.createTokens({
        email,
        role,
      });
      res.setHeader(CONST_ACCESS_TOKEN_HEADER, access_token);
      res.setHeader(CONST_REFRESH_TOKEN_HEADER, refresh_token);
      return { ...user, email };
    } catch (error) {
      this.logger.error(error.message);
      if (error instanceof QueryFailedError) {
        throw new NotAcceptableException((error as any).detail);
      }
      throw error;
    }
  }
}
