import { INVITATION_OR_JOIN_TYPE, INVITATION_OR_JOIN_ROLE } from "../enums";
import { SchoolSchema } from "./school";
import { UserSchema } from "./user";

export interface Invitations_JoinsSchema{
    type: INVITATION_OR_JOIN_TYPE;
    school: SchoolSchema;
    user: UserSchema;
    created_at: Date;
    role: INVITATION_OR_JOIN_ROLE;
}