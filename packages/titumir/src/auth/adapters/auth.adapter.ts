import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { CONST_JWT_ACCESS_TOKEN_COOKIE, COOKIE_SIGNATURE } from "../../../config";
import { ServerOptions } from "socket.io";
import { AuthService } from "../auth.service";
import cookie from "cookie";
import { signedCookies } from "cookie-parser";

export class AuthenticatedSocketIoAdapter extends IoAdapter {
    private readonly authService: AuthService;
    constructor(private app: INestApplicationContext) {
        super(app);
        this.authService = this.app.get(AuthService);
    }

    createIOServer(port: number, options: ServerOptions): any {
        options.allowRequest = async (request, allowFunction) => {
            const verified = await (async () => {
                try {
                    const cookieRaw = request.headers.cookie;
                    if (!cookieRaw || !COOKIE_SIGNATURE) return false;
                    const auth_token = signedCookies(
                        cookie.parse(cookieRaw),
                        COOKIE_SIGNATURE,
                    )?.[CONST_JWT_ACCESS_TOKEN_COOKIE];
                    if (!auth_token) return false;
                    const user = await this.authService.verify(auth_token);

                    Object.assign(request, { user });
                    return !!user;
                } catch (error: any) {
                    return false;
                }
            })();
            if (!verified) return allowFunction("Unauthorized", false);
            return allowFunction(null, true);
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return super.createIOServer(port, options);
    }
}
