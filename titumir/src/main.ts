import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule, JWT_AUTH_GUARD } from "./app.module";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import csurf from "csurf";
import { ValidationPipe } from "@nestjs/common";
import RoleAuthGuard from "./auth/guards/role-auth.guard";
import { QueryFailedFilter } from "./database/filters/query-failed.filter";
import { EntityNotFoundFilter } from "./database/filters/entity-not-found.filter";
import { PORT } from "../config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  const jwtAuthGuard = app.select(AppModule).get(JWT_AUTH_GUARD);
  const roleAuthGuard = new RoleAuthGuard(reflector);
  app.use(helmet());
  app.use(cookieParser());
  // app.use(csurf({ cookie: true }));
  app.useGlobalFilters(new QueryFailedFilter(), new EntityNotFoundFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(jwtAuthGuard, roleAuthGuard);
  await app.listen(PORT);
}
bootstrap();
