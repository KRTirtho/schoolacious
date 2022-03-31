import { SetMetadata } from "@nestjs/common";

export const EXTEND_USER_RELATION_KEY = "userRelations";
export const ExtendUserRelation = (...relations: string[]) =>
    SetMetadata(EXTEND_USER_RELATION_KEY, relations);
