import { useUser } from '@supabase/supabase-auth-helpers/react';
import { useEffect, useState } from 'react';

export default function useLoggedIn(def = true): boolean {
  const [loggedIn, setLoggedIn] = useState(def);
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!user && !isLoading && loggedIn) setLoggedIn(false);
    else if (user && !loggedIn) setLoggedIn(true);
  }, [user, isLoading, loggedIn]);

  return loggedIn;
}
