import { SetMetadata } from "@nestjs/common";
import { USER_ROLE } from "@schoolacious/types";

export const Roles = (...args: USER_ROLE[]) => SetMetadata("roles", args);
