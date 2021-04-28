import { SetMetadata } from "@nestjs/common";

export const VERIFY_GRADE_KEY = "verifyGrade";

export const VerifyGrade = () => {
  return <T>(
    target: T,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    SetMetadata(VERIFY_GRADE_KEY, true)(target, propertyKey, descriptor);
  };
};
