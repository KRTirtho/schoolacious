import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule, JWT_AUTH_GUARD, THROTTLER_GUARD } from "./app.module";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import RoleAuthGuard from "./auth/guards/role-auth.guard";
import { QueryFailedFilter } from "./database/filters/query-failed.filter";
import { EntityNotFoundFilter } from "./database/filters/entity-not-found.filter";
import {
    CONST_JWT_ACCESS_TOKEN_COOKIE,
    CONST_REFRESH_TOKEN_HEADER,
    COOKIE_SIGNATURE,
    CORS_ALLOW_ORIGIN,
    PORT,
} from "../config";
import { AuthenticatedSocketIoAdapter } from "./auth/adapters/auth.adapter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import JwtAuthGuard from "./auth/guards/jwt-auth.guard";
import { Logger } from "nestjs-pino";

declare global {
    /**
     * Mock fetch type just avoid the errors in server
     */
    const fetch: (url: string) => Promise<{ text(): string }>;
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    // swagger stuff
    const options = new DocumentBuilder()
        .setTitle("Titumir - schoolacious backend")
        .setDescription("mainstream backend of Schoolacious")
        .setVersion("0.1.0")
        .addCookieAuth(CONST_JWT_ACCESS_TOKEN_COOKIE, { type: "http" })
        .build();
    const document = SwaggerModule.createDocument(app, options);

    // const swaggerSetupOpts = {
    //     swaggerOptions: {
    //         requestInterceptor: async (req: Request) => {
    //             try {
    //                 req.headers["CSRF-TOKEN"] = await fetch("/csrf").then((r) =>
    //                     r.text(),
    //                 );
    //                 return req;
    //             } catch (error) {
    //                 console.error(error);
    //             }
    //         },
    //     },
    // };

    SwaggerModule.setup("/swagger", app, document /* , swaggerSetupOpts */);

    const reflector = app.get(Reflector);
    const jwtAuthGuard: JwtAuthGuard = app.select(AppModule).get(JWT_AUTH_GUARD);
    const roleAuthGuard = new RoleAuthGuard(reflector);
    const throttlerGuard: ThrottlerGuard = app.select(AppModule).get(THROTTLER_GUARD);
    app.use(helmet());
    app.useLogger(app.get(Logger));
    app.enableCors({
        origin: [/http:\/\/localhost:?[\d]+/, ...(CORS_ALLOW_ORIGIN ?? "").split(",")],
        exposedHeaders: [
            CONST_REFRESH_TOKEN_HEADER,
            "Accept-Version",
            "Authorization",
            "Credentials",
            "Content-Type",
            "CSRF-TOKEN",
        ],
        credentials: true,
        methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
    });
    app.use(cookieParser(COOKIE_SIGNATURE));
    app.useGlobalFilters(new QueryFailedFilter(), new EntityNotFoundFilter());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalGuards(throttlerGuard, jwtAuthGuard, roleAuthGuard);
    app.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(app));
    await app.listen(PORT);
    process.on("exit", app.close);
    process.on("uncaughtException", app.close);
    process.on("SIGTERM", app.close);
}
bootstrap();
