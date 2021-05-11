import { USER_ROLE } from "../database/entity/users.entity";

export function isAdministrative(role: USER_ROLE): boolean {
  return [USER_ROLE.admin, USER_ROLE.coAdmin].includes(role);
}

export function isGradeAdministrative(role: USER_ROLE): boolean {
  return [USER_ROLE.gradeExaminer, USER_ROLE.gradeModerator].includes(role);
}
