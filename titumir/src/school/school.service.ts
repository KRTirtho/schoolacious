import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import BasicEntityService, {
  PartialKey,
} from "../database/abstracts/entity-service.abstract";
import School from "../database/entity/schools.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { UserService } from "../user/user.service";

type CreateSchool = PartialKey<School, "_id" | "created_at">;

@Injectable()
export class SchoolService extends BasicEntityService<School, CreateSchool> {
  constructor(
    @InjectRepository(School) private readonly schoolRepo: Repository<School>,
    private readonly userService: UserService
  ) {
    super(schoolRepo);
  }
  // after creation of school admin/user needs to be assigned
  // automatically as a `admin` USER_ROLE
  // if user already has school then the flow will break
  async createSchool(payload: CreateSchool): Promise<School> {
    const hasSchool = await this.userHasSchool(payload.admin._id);
    if (hasSchool || payload.admin.role) {
      throw new BadRequestException("user already has joined a school");
    }
    const newSchool = await super.create(payload);

    const admin = await this.userService.findOneAndUpdate(
      { _id: payload.admin._id },
      {
        role: USER_ROLE.admin,
        school: newSchool,
      }
    );
    delete admin.school; // for circular json
    newSchool.admin = admin;
    return newSchool;
  }

  protected async userHasSchool(user_id: string): Promise<boolean> {
    const school = await this.schoolRepo.findOne({ admin: { _id: user_id } });
    return !!school;
  }

  async assignCoAdmin({
    index,
    user,
    user_id,
  }: {
    user_id: string;
    user: User;
    index: number;
  }) {
    const newCoAdmin = await this.userService.findOne(
      { _id: user_id },
      { select: ["role", "_id", "school"], relations: ["school"] }
    );

    if (newCoAdmin.role === USER_ROLE.coAdmin) {
      throw new NotAcceptableException(
        "user already is a co-admin. Cannot assign twice"
      );
    }
    if (newCoAdmin.school._id !== user.school._id)
      throw new BadRequestException("user doesn't belong to same school");
    const payload: DeepPartial<School> = {};
    const coAdmin = index === 1 ? "coAdmin1" : "coAdmin2";
    payload[coAdmin] = newCoAdmin;
    const school = await this.findOne(
      { _id: user.school._id },
      { relations: [coAdmin] }
    );
    // working with previous co-admin(s)
    if (school[coAdmin]) {
      await this.userService.findOneAndUpdate(
        { _id: school[coAdmin]._id },
        {
          role: USER_ROLE.teacher,
        }
      );
    }
    Object.assign(school, payload);
    const updatedSchool = await this.schoolRepo.save(school);
    newCoAdmin.school = updatedSchool;
    newCoAdmin.role = USER_ROLE.coAdmin;
    // saving the new co-admin
    await this.userService.save(newCoAdmin);
    school[coAdmin].role = USER_ROLE.coAdmin;
    // this is to remove circular structure of json
    delete school[coAdmin].school;
    return school;
  }

  async removeCoAdmin(user: string | User, school: School, updateUser = true) {
    if (typeof user === "string") {
      user = await this.userService.findOne(
        { _id: user },
        { relations: ["school"] }
      );
    }
    if (user?.school?._id !== school._id)
      throw new BadRequestException("user doesn't belong to the school");
    if (user.role !== USER_ROLE.coAdmin)
      throw new BadRequestException("user isn't a co-admin");

    const coAdminField =
      school?.coAdmin1?._id === user._id ? "coAdmin1" : "coAdmin2";
    school[coAdminField] = null;
    if (updateUser) {
      user.role = USER_ROLE.teacher;
      await this.userService.save(user);
    }
    return await this.schoolRepo.save(school);
  }
}
