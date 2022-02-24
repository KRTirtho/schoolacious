import {
  Button,
  chakra,
  Heading,
  Stack,
  Link as CUILink,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';
import { useMutation } from 'react-query';
import { MutationContextKey } from 'configs/enums';
import MaskedPasswordField from 'components/shared/MaskedPasswordField/MaskedPasswordField';
import { object, string, ref } from 'yup';
import TextField from 'components/shared/TextField/TextField';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import { titumir } from 'services/titumir';
import { SignInResponse } from './login';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import Link from 'next/link';
import Paper from 'components/shared/Paper/Paper';

interface SignupInitValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export type SignUpResponse = Omit<SignInResponse, 'url' | 'provider'>;

function Signup() {
  const router = useRouter();
  const SignupSchema = useMemo(
    () =>
      object().shape({
        email: string().email('Invalid email').required(),
        password: string().min(8).required(),
        confirmPassword: string()
          .required()
          .oneOf([ref('password'), null], 'Passwords must match'),
      }),
    []
  );

  const api = titumir.supabase;

  const { mutate: signup, isSuccess } = useMutation<
    SignUpResponse,
    Error,
    SignupInitValues
  >(
    MutationContextKey.SIGNUP,
    ({ email, password }) => api.auth.signUp({ email, password }),
    {
      onSuccess({ error }) {
        if (!error) setTimeout(() => router.push('/auth/verify'), 500);
      },
    }
  );

  const { user, isLoading } = useUser();
  useEffect(() => {
    if (!isLoading && user) router.push('/');
  }, [user, isLoading, router]);
  return (
    <VStack justify="center" h="100vh" overflow="auto">
      <Paper colorScheme="tinted" p="5">
        <Heading textAlign="center" mb="2" variant="h4">
          Create an account
        </Heading>
        <Formik
          initialValues={
            {
              email: '',
              password: '',
              confirmPassword: '',
            } as SignupInitValues
          }
          onSubmit={(values, { resetForm, setSubmitting }) => {
            signup(values);
            if (isSuccess) resetForm();
            else setSubmitting(false);
          }}
          validationSchema={SignupSchema}
        >
          <chakra.form as={Form} overflow="auto">
            <Stack direction="column" spacing="2">
              <Field
                component={TextField}
                name="email"
                type="email"
                label="Email"
                required
              />
              <Field
                component={MaskedPasswordField}
                name="password"
                label="Password"
                required
              />
              <Field
                component={MaskedPasswordField}
                name="confirmPassword"
                label="Confirm Password"
                required
              />
              <Button type="submit">Signup</Button>
              <p>
                Already have an account?{' '}
                <CUILink mt="2" as={Link} href="/auth/login">
                  Login
                </CUILink>
              </p>
            </Stack>
          </chakra.form>
        </Formik>
      </Paper>
    </VStack>
  );
}

export default Signup;
