import { SetMetadata } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../auth/guards/jwt-auth.guard";

export const Public = (isPublic = true) => SetMetadata(IS_PUBLIC_KEY, isPublic);
