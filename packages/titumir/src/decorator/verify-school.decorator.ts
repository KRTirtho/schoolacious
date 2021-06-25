import { SetMetadata } from "@nestjs/common";

export const VERIFY_SCHOOL_KEY = "verify-school";
export const VerifySchool = () => SetMetadata(VERIFY_SCHOOL_KEY, true);
