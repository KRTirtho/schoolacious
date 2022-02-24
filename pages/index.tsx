import type { NextPage } from 'next';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { titumir, UserSchema } from 'services/titumir';
import { useQuery } from 'react-query';
import MetadataModal from 'components/pages/index/MetadataModal';
import queryString from 'query-string';

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  const { user, isLoading, error } = useUser();
  const router = useRouter();
  const {
    data: userMeta,
    refetch,
    isLoading: isMetaLoading,
  } = useQuery<UserSchema | null | undefined>(
    'user-metadata',
    () => titumir.user.me(user).then((s) => s?.data),
    // Don't want to run the query before the user fetch is done
    // useUser can return null/undefined initially sometimes even though
    // correct credentials are available & there's an user
    { enabled: !!user }
  );

  useEffect(() => {
    const query = queryString.parse(window.location.hash) ?? {};
    if (query.type === 'recovery') router.push('/settings/new-password');
  }, []);

  useEffect(() => {
    if (!user && !isLoading) router.push('/auth/login');
    else if (!userMeta && user) refetch();
  }, [user, isLoading, router]);

  useEffect(() => {
    if (userMeta === null && isMetaLoading === false) onOpen();
    else onClose();
  }, [userMeta, isMetaLoading, onOpen, onClose]);

  if (!user) {
    return <>{error && <p>{error.message}</p>}</>;
  }

  return (
    <>
      <MetadataModal isOpen={isOpen} onClose={onClose} />
      <Button
        colorScheme="red"
        onClick={() =>
          titumir.supabase.auth.signOut().then(() => router.push('/auth/login'))
        }
      >
        Sign out
      </Button>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
};

export default Home;
