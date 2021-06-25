import { SetMetadata } from "@nestjs/common";
import { USER_ROLE } from "../database/entity/users.entity";

export const Roles = (...args: USER_ROLE[]) => SetMetadata("roles", args);
