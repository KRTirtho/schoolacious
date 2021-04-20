import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import csurf from "csurf";
import { ValidationPipe } from "@nestjs/common";
import JwtAuthGuard from "./auth/guards/jwt-auth.guard";
import RoleAuthGuard from "./auth/guards/role-auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  const jwtAuthGuard = new JwtAuthGuard(reflector);
  const roleAuthGuard = new RoleAuthGuard(reflector);
  app.use(helmet());
  app.use(cookieParser());
  // app.use(csurf({ cookie: true }));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(jwtAuthGuard, roleAuthGuard);
  await app.listen(4000);
}
bootstrap();
