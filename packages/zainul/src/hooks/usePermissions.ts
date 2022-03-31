import { UserSchema, USER_ROLE } from "@schoolacious/types";
import { useAuthStore } from "state/authorization-store";

export function usePermissions(allowed: USER_ROLE[], user?: UserSchema): boolean {
    const fUser = user ?? useAuthStore((s) => s.user);

    if (allowed.length < 1) return true;

    return !!(fUser?.role && allowed.includes(fUser.role));
}
