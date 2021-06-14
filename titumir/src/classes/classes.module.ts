import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Class from "../database/entity/classes.entity";
import { SectionModule } from "../section/section.module";
import { ClassesController } from "./classes.controller";
import { ClassesService } from "./classes.service";

@Module({
    imports: [TypeOrmModule.forFeature([Class]), SectionModule],
    controllers: [ClassesController],
    providers: [ClassesService],
})
export class ClassesModule {}
