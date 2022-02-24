import { Heading, Stack, Link } from '@chakra-ui/react';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Verify = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  useEffect(() => {
    if (!isLoading && user) router.push('/');
  }, [user, isLoading, router]);
  return (
    <Stack alignItems="center">
      <Heading textAlign="center">Verification</Heading>
      <p>
        A verification email has been sent to your email address. Click the
        provided URL to activate your account
      </p>
      <Link href="https://mail.google.com/mail/u/0/" target="_blank">
        Open in Gmail
      </Link>
    </Stack>
  );
};

export default Verify;
