import { INestApplicationContext, Logger } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ExtractJwt } from "passport-jwt";
import { UserService } from "../../user/user.service";
import { AuthService } from "../auth.service";

export class AuthenticatedSocketIoAdapter extends IoAdapter {
    logger: Logger = new Logger(AuthenticatedSocketIoAdapter.name);
    private readonly authService: AuthService;
    private readonly userService: UserService;
    constructor(private app: INestApplicationContext) {
        super(app);
        this.authService = this.app.get(AuthService);
        this.userService = this.app.get(UserService);
    }

    createIOServer(port: number, options: SocketIO.ServerOptions = {}): any {
        options.allowRequest = async (request, allowFunction) => {
            const verified = await (async () => {
                try {
                    const auth_token = ExtractJwt.fromAuthHeaderAsBearerToken()(
                        request as any,
                    );
                    if (!auth_token) return false;
                    const tokenUser = await this.authService.verify(auth_token);
                    const user = await this.userService.findOne(tokenUser);

                    Object.assign(request, { user });
                    return !!user;
                } catch (error) {
                    this.logger.error(error.message);
                    return false;
                }
            })();
            if (!verified) return allowFunction("Unauthorized", false);
            return allowFunction(null, true);
        };

        return super.createIOServer(port, options);
    }
}
