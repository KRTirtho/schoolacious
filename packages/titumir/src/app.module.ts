import { Logger, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import JwtAuthGuard from "./auth/guards/jwt-auth.guard";
import { DatabaseModule } from "./database/database.module";
import { GradeModule } from "./grade/grade.module";
import { InvitationJoinModule } from "./invitation-join/invitation-join.module";
import { SchoolModule } from "./school/school.module";
import { SectionModule } from "./section/section.module";
import { SubjectModule } from "./subject/subject.module";
import { UserModule } from "./user/user.module";
import { ClassesModule } from "./classes/classes.module";
import { NotificationModule } from "./notification/notification.module";

export const JWT_AUTH_GUARD = "JWT_AUTH_GUARD";
export const THROTTLER_GUARD = "THROTTLER_GUARD";

@Module({
    imports: [
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        ScheduleModule.forRoot(),
        DatabaseModule,
        AuthModule,
        UserModule,
        SchoolModule,
        InvitationJoinModule,
        GradeModule,
        SubjectModule,
        SectionModule,
        ClassesModule,
        NotificationModule,
    ],
    controllers: [AppController],
    providers: [
        Logger,
        AppService,
        // guards
        { provide: THROTTLER_GUARD, useClass: ThrottlerGuard },
        { provide: JWT_AUTH_GUARD, useClass: JwtAuthGuard },
    ],
})
export class AppModule {}
