import { useUser } from '@supabase/supabase-auth-helpers/react';
import { useEffect, useState } from 'react';

export default function useLoggedIn(): boolean {
  const [loggedIn, setLoggedIn] = useState(true);
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!user && !isLoading) setLoggedIn(false);
  }, [user, isLoading]);

  return loggedIn;
}
