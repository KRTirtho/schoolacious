import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import bcrypt from "bcrypt";
import User from "../database/entity/users.entity";
import {
    CONST_JWT_ACCESS_EXPIRATION_DURATION,
    CONST_JWT_REFRESH_EXPIRATION_DURATION,
    NOT_A_SECRET,
} from "../../config";

export type TokenUser = Pick<User, "email" | "role">;

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validate(email: string, password: string) {
        const user = await this.userService.findOneRaw(
            { email },
            {
                select: ["password"],
            },
        );
        if (!user) {
            throw new NotFoundException("user doesn't exist");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new BadRequestException("wrong credentials");
        }
        return { ...user, password: undefined };
    }

    getAccessToken(payload: TokenUser) {
        return this.jwtService.sign(
            { ...payload },
            {
                expiresIn: CONST_JWT_ACCESS_EXPIRATION_DURATION,
            },
        );
    }

    getRefreshToken(payload: TokenUser) {
        return this.jwtService.sign(
            { ...payload },
            {
                expiresIn: CONST_JWT_REFRESH_EXPIRATION_DURATION,
            },
        );
    }

    createTokens(payload: TokenUser) {
        return {
            access_token: this.getAccessToken(payload),
            refresh_token: this.getRefreshToken(payload),
        };
    }

    // Get the payload of the token using jwt decode
    async getUserFromRefreshToken(
        token: string,
        options?: { full?: boolean },
    ): Promise<User | TokenUser> {
        const tokenUser = this.jwtService.decode(token) as TokenUser;
        if (!options?.full) return tokenUser;
        return this.userService.findOne({ email: tokenUser.email });
    }

    async verify(token: string) {
        const payload = this.jwtService.verify(token, { secret: NOT_A_SECRET });
        const user = await this.userService.findOne({ email: payload.email });
        if (!user) {
            throw new NotFoundException("aborted for maliciousness");
        }
        return user;
    }
}
