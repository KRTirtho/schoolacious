import { Body, Controller, Post } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { USER_ROLE } from "../database/entity/users.entity";
import { Roles } from "../decorator/roles.decorator";
import { VerifyGrade } from "../decorator/verify-grade.decorator";
import { ClassesService } from "./classes.service";
import ScheduleClassDTO from "./dto/schedule-class.dto";

@Controller("classes")
export class ClassesController {
    constructor(
        private classesService: ClassesService,
        private scheduleRegistry: SchedulerRegistry,
    ) {}

    @Post(":section/schedule-classes")
    @VerifyGrade()
    @Roles(
        USER_ROLE.admin,
        USER_ROLE.coAdmin,
        USER_ROLE.gradeModerator,
        USER_ROLE.classTeacher,
    )
    async scheduleClasses(@Body() body: ScheduleClassDTO) {
        try {
        } catch (error) {}
    }
}
