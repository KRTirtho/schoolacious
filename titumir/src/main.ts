import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule, JWT_AUTH_GUARD, THROTTLER_GUARD } from "./app.module";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import csurf from "csurf";
import { ValidationPipe } from "@nestjs/common";
import RoleAuthGuard from "./auth/guards/role-auth.guard";
import { QueryFailedFilter } from "./database/filters/query-failed.filter";
import { EntityNotFoundFilter } from "./database/filters/entity-not-found.filter";
import { PORT } from "../config";
import { AuthenticatedSocketIoAdapter } from "./auth/adapters/auth.adapter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // swagger stuff
    const options = new DocumentBuilder()
        .setTitle("Titumir - veschool backend")
        .setDescription("mainstream backend of VESchool")
        .setVersion("0.1.0")
        .addBearerAuth({ type: "http", bearerFormat: "Bearer" })
        .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup("/swagger", app, document);

    const reflector = app.get(Reflector);
    const jwtAuthGuard = app.select(AppModule).get(JWT_AUTH_GUARD);
    const roleAuthGuard = new RoleAuthGuard(reflector);
    const throttlerGuard = app.select(AppModule).get(THROTTLER_GUARD);
    app.use(helmet());
    app.use(cookieParser());
    // app.use(csurf({ cookie: true }));
    app.useGlobalFilters(new QueryFailedFilter(), new EntityNotFoundFilter());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalGuards(throttlerGuard, jwtAuthGuard, roleAuthGuard);
    app.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(app));
    await app.listen(PORT);
}
bootstrap();
