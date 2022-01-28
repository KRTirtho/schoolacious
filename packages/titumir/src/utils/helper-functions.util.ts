import { USER_ROLE } from "@schoolacious/types";

export function isAdministrative(role?: USER_ROLE | null): boolean {
    if (!role) return false;
    return [USER_ROLE.admin, USER_ROLE.coAdmin].includes(role);
}

export function isGradeAdministrative(role?: USER_ROLE | null): boolean {
    if (!role) return false;
    return [USER_ROLE.gradeExaminer, USER_ROLE.gradeModerator].includes(role);
}
