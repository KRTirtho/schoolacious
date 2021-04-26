import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { SchoolModule } from "./school/school.module";
import { InvitationJoinModule } from "./invitation-join/invitation-join.module";
import { GradeModule } from './grade/grade.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    SchoolModule,
    InvitationJoinModule,
    GradeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
