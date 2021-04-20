import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import School from "../database/entity/schools.entity";
import { UserModule } from "../user/user.module";
import { SchoolController } from "./school.controller";
import { SchoolService } from "./school.service";

@Module({
  imports: [TypeOrmModule.forFeature([School]), UserModule],
  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [SchoolService],
})
export class SchoolModule {}
