import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from "typeorm";
import School from "../database/entity/schools.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School) private readonly schoolRepo: Repository<School>,
    private readonly userService: UserService
  ) {}

  // after creation of school admin/user needs to be assigned
  // automatically as a `admin` USER_ROLE
  // if user already has school then the flow will break
  async create(
    payload: Omit<School, "_id" | "invitations_joins" | "created_at">
  ): Promise<School> {
    const hasSchool = await this.userHasSchool(payload.admin._id);
    if (hasSchool || payload.admin.role) {
      throw new BadRequestException("User already has joined a school");
    }
    const school = new School();
    Object.assign(school, {
      ...payload,
      admin: { ...payload.admin, role: USER_ROLE.admin },
    });
    const newSchool = await this.schoolRepo.save(school);

    const admin = await this.userService.findUserAndUpdate(payload.admin._id, {
      role: USER_ROLE.admin,
      school: newSchool,
    });
    delete admin.school; // for circular json
    newSchool.admin = admin;
    return newSchool;
  }

  async userHasSchool(user_id: string): Promise<boolean> {
    const school = await this.schoolRepo.findOne({ admin: { _id: user_id } });
    return !!school;
  }

  findSchool(
    conditions: FindConditions<School>,
    options?: FindOneOptions<School>
  ): Promise<School> {
    return this.schoolRepo.findOneOrFail(conditions, options);
  }

  findSchoolUnsafe(
    conditions: FindConditions<School>,
    options?: FindOneOptions<School>
  ) {
    return this.schoolRepo.findOne(conditions, options);
  }

  findAll(
    conditions: FindConditions<School>,
    options?: FindManyOptions<School>
  ): Promise<School[]> {
    return this.schoolRepo.find({ ...conditions, ...options });
  }

  async update(
    conditions: FindConditions<School>,
    payload?: DeepPartial<Omit<School, "_id">>,
    options?: FindOneOptions<School>
  ): Promise<School> {
    const school = await this.findSchool(conditions, options);
    Object.assign(school, payload);
    return this.schoolRepo.save(school);
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
    const newCoAdmin = await this.userService.findUser(
      { _id: user_id },
      { select: ["role", "_id", "school"], relations: ["school"] }
    );

    if (newCoAdmin.role === USER_ROLE.coAdmin) {
      throw new NotAcceptableException(
        "User already is a co-admin. Cannot assign twice"
      );
    }
    if (newCoAdmin.school._id !== user.school._id)
      throw new BadRequestException("User doesn't belong to same school");
    const payload: DeepPartial<School> = {};
    const coAdmin = index === 1 ? "coAdmin1" : "coAdmin2";
    payload[coAdmin] = newCoAdmin;
    const school = await this.findSchool(
      { _id: user.school._id },
      { relations: [coAdmin] }
    );
    // working with previous co-admin(s)
    if (school[coAdmin]) {
      await this.userService.findUserAndUpdate(school[coAdmin]._id, {
        role: USER_ROLE.teacher,
      });
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
}
