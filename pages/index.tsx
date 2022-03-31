import type { NextPage } from 'next';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import MetadataModal from 'components/pages/index/MetadataModal';
import queryString from 'query-string';
import NoSchool from 'components/pages/index/NoSchool';
import { useUserMeta } from 'services/titumir-hooks/useUserMeta';

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  const router = useRouter();
  const { user, isLoading, error } = useUser();
  const { data: userMeta, refetch, isLoading: isMetaLoading } = useUserMeta();

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
      {userMeta?.school ? <></> : <NoSchool />}
    </>
  );
};

export default Home;
