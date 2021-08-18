import { UserSchema } from "@veschool/types";

export function userToName(user?: UserSchema | null) {
    if (!user) return "N/A";
    return `${user?.first_name} ${user?.last_name}`;
}
