import { Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import Paper from 'components/shared/Paper/Paper';
import TextField from 'components/shared/TextField/TextField';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { titumir } from 'services/titumir';
import { string, object } from 'yup';

const ResetPassword = () => {
  const router = useRouter();
  const schema = useMemo(() => {
    return object().shape({
      email: string().email().required(),
    });
  }, []);

  const { user, isLoading } = useUser();
  useEffect(() => {
    if (!isLoading && user) router.push('/');
  }, [user, isLoading, router]);

  return (
    <VStack h="100vh" justify="center" overflow="auto">
      <Paper colorScheme="tinted" p="5">
        <Heading>Reset Password</Heading>
        <Text color="gray">
          A confirmation email with verification url will be sent to your email
          address. Click/visit that URL for resetting your password
        </Text>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={schema}
          onSubmit={async ({ email }, { setSubmitting, resetForm }) => {
            const { error } =
              await titumir.supabase.auth.api.resetPasswordForEmail(email);
            if (!error) resetForm();
            else setSubmitting(false);
            setTimeout(() => router.push('/auth/verify'), 500);
          }}
        >
          <Form>
            <VStack spacing="2" align="stretch">
              <Field
                name="email"
                placeholder="Your Email Address"
                component={TextField}
                required
              />
              <Button type="submit">Send</Button>
            </VStack>
          </Form>
        </Formik>
      </Paper>
    </VStack>
  );
};

export default ResetPassword;
