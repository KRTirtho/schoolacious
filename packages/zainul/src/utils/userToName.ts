import { UserSchema } from "@veschool/types";

export function userToName(user?: UserSchema | null) {
    return `${user?.first_name} ${user?.last_name}`;
}
