import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Class from "../database/entity/classes.entity";
import { NotificationModule } from "../notification/notification.module";
import { SectionModule } from "../section/section.module";
import { ClassesController } from "./classes.controller";
import { ClassesService } from "./classes.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Class]),
        SectionModule,
        NotificationModule,
    ],
    controllers: [ClassesController],
    providers: [ClassesService],
})
export class ClassesModule {}
