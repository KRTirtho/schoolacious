import { useQuery, UseQueryResult } from 'react-query';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { QueryContextKey } from 'configs/enums';
import { useEffect } from 'react';
import { titumir } from 'services/titumir';
import { SchoolAssociatedUserSchema } from 'services/titumir/subcontrollers/user';

export function useUserMeta(): UseQueryResult<
  SchoolAssociatedUserSchema | null | undefined
> {
  const { user, isLoading } = useUser();
  const data = useQuery<SchoolAssociatedUserSchema | null | undefined>(
    QueryContextKey.QUERY_USER_META,
    () => titumir.user.me(user).then((s) => s?.data),
    // Don't want to run the query before the user fetch is done
    // useUser can return null/undefined initially sometimes even though
    // correct credentials are available & there's an user
    { enabled: !!user }
  );
  useEffect(() => {
    if (!data.data && user && !data.isError) data.refetch();
  }, [user, isLoading, data]);

  return data;
}
