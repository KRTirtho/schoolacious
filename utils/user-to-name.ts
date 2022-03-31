import { UserSchema } from 'services/titumir';

export function userToName(
  user?:
    | (Pick<UserSchema, 'firstname' | 'lastname'> &
        Record<string | number, any>)
    | null
) {
  if (!user) return 'N/A';
  return `${user?.firstname} ${user?.lastname}`;
}
