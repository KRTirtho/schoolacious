import {
  Body,
  Controller,
  Logger,
  Post,
  NotAcceptableException,
} from "@nestjs/common";
import { DeepPartial } from "typeorm";
import School from "../database/entity/schools.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { UserService } from "../user/user.service";
import AddCoAdminDTO from "./dto/add-co-admin.dto";
import CreateSchoolDTO from "./dto/create-school.dto";
import { SchoolService } from "./school.service";

@Controller("school")
export class SchoolController {
  logger: Logger = new Logger(SchoolController.name);
  constructor(
    private readonly schoolService: SchoolService,
    private readonly userService: UserService
  ) {}

  @Post()
  async createSchool(@CurrentUser() user: User, @Body() body: CreateSchoolDTO) {
    try {
      const school = await this.schoolService.create({ admin: user, ...body });
      return school;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Post("co-admin")
  async addCoAdmin(@Body() body: AddCoAdminDTO) {
    try {
      const newCoAdmin = await this.userService.findUser(
        { _id: body._id },
        { select: ["role"] }
      );

      if (newCoAdmin.role === USER_ROLE.coAdmin) {
        throw new NotAcceptableException(
          "User already is a co-admin. Cannot assign twice"
        );
      }
      const payload: DeepPartial<School> = {};
      payload[body.index === 1 ? "coAdmin1" : "coAdmin2"] = { _id: body._id };
      this.schoolService.update({ _id: body.school_id }, payload);
    } catch (error) {
      this.logger.log(error.message);
      throw error;
    }
  }
}
