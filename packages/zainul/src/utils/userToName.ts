import { UserSchema } from "@schoolacious/types";

export function userToName(
    user?:
        | (Pick<UserSchema, "first_name" | "last_name"> & Record<string | number, any>)
        | null,
) {
    if (!user) return "N/A";
    return `${user?.first_name} ${user?.last_name}`;
}
