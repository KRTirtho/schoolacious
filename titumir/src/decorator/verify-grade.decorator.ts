import { applyDecorators, SetMetadata } from "@nestjs/common";
import { VerifySchool } from "./verify-school.decorator";

export const VERIFY_GRADE_KEY = "verifyGrade";

export const VerifyGrade = () => {
  return applyDecorators(VerifySchool(), SetMetadata(VERIFY_GRADE_KEY, true));
};
