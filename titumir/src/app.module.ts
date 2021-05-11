import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { SchoolModule } from "./school/school.module";
import { InvitationJoinModule } from "./invitation-join/invitation-join.module";
import { GradeModule } from "./grade/grade.module";
import { SubjectModule } from "./subject/subject.module";
import { SectionModule } from "./section/section.module";
import JwtAuthGuard from "./auth/guards/jwt-auth.guard";

export const JWT_AUTH_GUARD = "JWT_AUTH_GUARD";

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    SchoolModule,
    InvitationJoinModule,
    GradeModule,
    SubjectModule,
    SectionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // guards
    { provide: JWT_AUTH_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
