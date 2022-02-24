import {
  Flex,
  Heading,
  Button,
  Link as CUILink,
  chakra,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';
import { useMutation } from 'react-query';
import Link from 'next/link';
import MaskedPasswordField from 'components/shared/MaskedPasswordField/MaskedPasswordField';
import { MutationContextKey } from 'configs/enums';
import { titumir } from 'services/titumir';
import { object, string } from 'yup';
import TextField from 'components/shared/TextField/TextField';
import { Formik, Form, Field } from 'formik';
import { UserCredentials } from '@supabase/supabase-js';
import { Session, User, Provider, ApiError } from '@supabase/gotrue-js';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import Paper from 'components/shared/Paper/Paper';
export const MINIMUM_CHAR_MSG = 'Minimum 8 chars';
export const INVALID_EMAIL_MSG = 'Invalid email';

export interface SignInResponse {
  session: Session | null;
  user: User | null;
  provider?: Provider;
  url?: string | null;
  error: ApiError | null;
}

function Login() {
  const router = useRouter();
  const api = titumir.supabase;
  const { mutate: login, isSuccess } = useMutation<
    SignInResponse,
    Error,
    UserCredentials
  >(MutationContextKey.LOGIN, (body) => api.auth.signIn(body), {
    onSuccess({ error }) {
      if (!error) setTimeout(() => router.push('/'), 500);
    },
  });
  const LoginSchema = useMemo(
    () =>
      object().shape({
        email: string().email(INVALID_EMAIL_MSG).required(),
        password: string().min(8, MINIMUM_CHAR_MSG).required(),
      }),
    []
  );
  const { user, isLoading } = useUser();
  useEffect(() => {
    if (!isLoading && user) router.push('/');
  }, [user, isLoading, router]);

  return (
    <VStack justify="center" h="100vh" overflow="auto">
      <Paper colorScheme="tinted" p="5">
        <Heading my="2" as="h4" textAlign="center">
          Welcome back🎉
        </Heading>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            login(values);
            if (isSuccess) resetForm();
            else setSubmitting(false);
          }}
          validationSchema={LoginSchema}
        >
          <chakra.form as={Form} overflow="auto">
            <Flex direction="column">
              <Field
                mt="3"
                component={TextField}
                name="email"
                type="email"
                label="Email"
                required
              />
              <Field
                component={MaskedPasswordField}
                mt="3"
                name="password"
                label="Password"
                required
              />
              <Button my="3" type="submit">
                Login
              </Button>
            </Flex>
          </chakra.form>
        </Formik>
        <CUILink as={Link} href="/auth/reset-password">
          Forgot password?
        </CUILink>
        <p>
          Don&apos;t have an account?{' '}
          <CUILink mt="2" as={Link} href="/auth/signup">
            Create one
          </CUILink>
        </p>
      </Paper>
    </VStack>
  );
}

export default Login;
