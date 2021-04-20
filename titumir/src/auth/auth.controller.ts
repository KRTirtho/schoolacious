import {
  Body,
  Controller,
  Headers,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
  NotAcceptableException,
  UnauthorizedException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
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
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const { access_token, refresh_token } = this.authService.createTokens(
        req.user as TokenUser
      );
      res.setHeader(CONST_ACCESS_TOKEN_HEADER, access_token);
      res.setHeader(CONST_REFRESH_TOKEN_HEADER, refresh_token);
      return res.json(req.user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return res
          .status(HttpStatus.NOT_ACCEPTABLE)
          .json({ error: (error as any).detail });
      }
      return res.status(HttpStatus.FORBIDDEN).json(error.message);
    }
  }
  @Public()
  @Post("refresh")
  async refresh(@Headers() headers: Request["headers"], @Res() res: Response) {
    try {
      const refreshToken = headers[CONST_REFRESH_TOKEN_HEADER] as string;
      if (!refreshToken)
        throw new NotAcceptableException("refresh token not set");
      const isValid = await this.authService.verify(refreshToken);
      if (!isValid) throw new UnauthorizedException("invalid refresh token");
      const { access_token, refresh_token } = this.authService.createTokens(
        isValid
      );
      res.setHeader(CONST_ACCESS_TOKEN_HEADER, access_token);
      res.setHeader(CONST_REFRESH_TOKEN_HEADER, refresh_token);
      return res.json({ message: "Refreshed access_token" });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return res
          .status(HttpStatus.NOT_ACCEPTABLE)
          .json({ error: (error as any).detail });
      }
      return res.status(HttpStatus.FORBIDDEN).json(error.message);
    }
  }

  @Public()
  @Post("signup")
  async signup(@Body() body: SignupDTO, @Res() res: Response) {
    try {
      const { email, role, ...user } = await this.userService.create(body);
      const { access_token, refresh_token } = this.authService.createTokens({
        email,
        role,
      });
      res.setHeader(CONST_ACCESS_TOKEN_HEADER, access_token);
      res.setHeader(CONST_REFRESH_TOKEN_HEADER, refresh_token);
      return res.json({ ...user, email });
    } catch (error) {
      this.logger.error(error.message);
      if (error instanceof QueryFailedError) {
        return res
          .status(HttpStatus.NOT_ACCEPTABLE)
          .json({ error: (error as any).detail });
      }
      return res.status(HttpStatus.FORBIDDEN).json(error.message);
    }
  }
}
