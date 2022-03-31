import { definitions } from 'types/database';

export type SchoolSchema = definitions['school'];
export type UserSchema = definitions['user'];
export type RoleSchema = definitions['roles'];
export type GradeSchema = definitions['grade'];
export type InvitationSchema = definitions['invitation'];
export type SubjectSchema = definitions['subject'];
export type WeldSchema = definitions['weld'];

export type PartialKey<T, K extends PropertyKey = PropertyKey> = Partial<
  Pick<T, Extract<keyof T, K>>
> &
  Omit<T, K> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;
