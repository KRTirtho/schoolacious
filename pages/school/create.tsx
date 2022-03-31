import React, { useEffect } from 'react';
import { Container, Icon, Heading, Button, Stack } from '@chakra-ui/react';
import { FaSchool } from 'react-icons/fa';

import { useUserMeta } from 'services/titumir-hooks/useUserMeta';
import { useRouter } from 'next/router';
import { object, string, number } from 'yup';
import TextField, {
  TextareaField,
} from 'components/shared/TextField/TextField';
import { MutationContextKey } from 'configs/enums';
import { Formik, Form, Field } from 'formik';
import { useMutation } from 'react-query';
import { titumir, SchoolSchema } from 'services/titumir';

function SchoolCreate() {
  const { data: user } = useUserMeta();
  const router = useRouter();

  useEffect(() => {
    if (user?.school) router.push('/school');
  }, [user]);

  const CreateSchoolSchema = object().shape({
    name: string().required(),
    email: string().email().required(),
    phone: number().required(),
    description: string(),
    short_name: string()
      .matches(
        /^[a-z\d-]+$/,
        'only small letters, number & hyphens (-) are allowed'
      )
      .required(),
  });
  const initValues = {
    name: '',
    email: '',
    phone: '',
    description: '',
    short_name: '',
  };

  const { mutate: createSchool } = useMutation<
    SchoolSchema | null,
    unknown,
    typeof initValues
  >(MutationContextKey.CREATE_SCHOOL, (payload) =>
    titumir.school.create(payload).then(({ data }) => data)
  );

  return (
    <Container
      flexDirection="column"
      alignItems={{ base: 'stretch', md: 'center' }}
    >
      <Heading as="h5" mb="2" textAlign="center" size="md">
        <Icon color="primary">
          <FaSchool />
        </Icon>
        Create a School
      </Heading>
      <Formik
        initialValues={initValues}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          createSchool(values, {
            onSuccess: () => {
              resetForm();
              router.push('/');
            },
          });
          setSubmitting(false);
        }}
        validationSchema={CreateSchoolSchema}
      >
        <Form>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
            <Field
              name="name"
              component={TextField}
              required
              label="School Name"
              placeholder="e.g. Shamsul Haque Khan School"
            />
            <Field
              type="email"
              name="email"
              component={TextField}
              required
              label="Email"
              placeholder="school@test.com"
            />
          </Stack>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
            <Field
              type="tel"
              name="phone"
              component={TextField}
              required
              label="Phone"
              placeholder="e.g. 8801122334455"
            />
            <Field
              name="short_name"
              component={TextField}
              required
              label="Short Name"
              placeholder="e.g. school-231"
            />
          </Stack>
          <Field
            name="description"
            component={TextareaField}
            required
            label="Description"
            margin="normal"
            rows={5}
            placeholder="Describe the fundamentals of your school "
          />
          <Button isFullWidth mt="2" type="submit">
            Create
          </Button>
        </Form>
      </Formik>
    </Container>
  );
}

export default SchoolCreate;
