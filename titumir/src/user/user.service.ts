import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import User from "../database/entity/users.entity";
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from "typeorm";
import bcrypt from "bcrypt";

type SafeUser = Omit<User, "password">;

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create({
    password,
    ...props
  }: Pick<User, "email" | "first_name" | "last_name" | "password">) {
    const user = new User();
    const hashedPassword = await bcrypt.hash(password, 12);
    Object.assign(user, { ...props, password: hashedPassword });
    const newUser = await this.userRepo.save(user);
    delete newUser.password;
    return newUser;
  }

  findUser(
    conditions: FindConditions<DeepPartial<SafeUser>>,
    options?: FindOneOptions<User>
  ) {
    return this.userRepo.findOneOrFail(conditions, options);
  }

  // a special query that returns entire User Object/Column
  // but with the `password` or any other hidden field defined in it
  private buildRawUser(
    conditions: FindConditions<DeepPartial<SafeUser>>,
    options?: Pick<FindOneOptions<User>, "order" | "select" | "where">
  ) {
    const naive = this.userRepo
      .createQueryBuilder("user")
      .where(options?.where ?? conditions);
    if (options?.select) {
      for (const select of options.select) {
        naive.addSelect(`user.${select}`);
      }
    }
    if (options?.order) {
      for (let [key, value] of Object.entries(options?.order)) {
        key = key;
        if (value === 1) {
          value = "ASC";
        }
        if (value === -1) {
          value = "DESC";
        }
        naive.addOrderBy(`user.${key}`, value);
      }
    }
    return naive;
  }

  findUserRaw(
    conditions: FindConditions<DeepPartial<SafeUser>>,
    options?: Pick<FindOneOptions<User>, "order" | "select" | "where">
  ) {
    return this.buildRawUser(conditions, options).getOne();
  }

  findUsers(
    payload: FindConditions<DeepPartial<SafeUser>>,
    options?: FindManyOptions<User>
  ) {
    return this.userRepo.find({ ...payload, ...options });
  }

  async findUserAndUpdate(_id: string, payload: DeepPartial<SafeUser>) {
    const user = await this.userRepo.findOneOrFail(_id);
    Object.assign(user, payload);
  }

  // simple password changing method for user
  async changePassword(
    _id: string,
    { newPassword, oldPassword }: { oldPassword: string; newPassword: string }
  ) {
    const user = await this.findUser({ _id });
    const isValidPassword = bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new BadRequestException();
    }
    user.password = await bcrypt.hash(newPassword, 12);
    return this.userRepo.save(user);
  }
}
