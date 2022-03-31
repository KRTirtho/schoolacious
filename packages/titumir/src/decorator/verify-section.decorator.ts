import { applyDecorators, SetMetadata } from "@nestjs/common";
import { VerifyGrade } from "./verify-grade.decorator";

export const VERIFY_SECTION_KEY = "verifySection";

export const VerifySection = () => {
    return applyDecorators(VerifyGrade(), SetMetadata(VERIFY_SECTION_KEY, true));
};
