import React, { useEffect } from 'react';
import { Container, Icon, Heading } from '@chakra-ui/react';
import { FaSchool } from 'react-icons/fa';

import { useUserMeta } from 'services/titumir-hooks/useUserMeta';
import CreateSchoolForm from 'components/pages/school/create/CreateSchoolForm';
import { useRouter } from 'next/router';

function SchoolCreate() {
  const { data: user } = useUserMeta();
  const router = useRouter();

  useEffect(() => {
    if (user?.school) router.push('/school');
  }, [user, router]);

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
      <CreateSchoolForm />
    </Container>
  );
}

export default SchoolCreate;
