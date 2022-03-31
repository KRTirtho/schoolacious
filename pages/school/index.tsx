import {
  Flex,
  Heading,
  Box,
  Image,
  Link as Clink,
  Text,
  IconButton,
  chakra,
  HStack,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { IoIosSettings } from 'react-icons/io';
import Link from 'next/link';
import { useUserMeta } from 'services/titumir-hooks/useUserMeta';
import { useRouter } from 'next/router';

function School() {
  const { data } = useUserMeta();
  const router = useRouter();
  const school = data?.school;

  // const isAllowed = usePermissions([USER_ROLE.admin, USER_ROLE.coAdmin]);
  const isAllowed = true;

  useEffect(() => {
    if (!school) router.push('/school/create');
  }, [school, router]);

  return (
    <Flex direction="column">
      <Box
        w="full"
        h="300px"
        bgPos="center"
        bgRepeat="no-repeat"
        bg="url(https://images.unsplash.com/photo-1560447992-466be70a0c49?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)"
      ></Box>
      <HStack
        justify="space-between"
        p="2"
        align="flex-end"
        transform="translateY(-50%)"
      >
        <chakra.div>
          <Image
            boxSize="8rem"
            rounded="sm"
            src="https://images.unsplash.com/photo-1560447992-466be70a0c49?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="School Banner"
          />
          <HStack>
            <Heading size="lg">{school?.name}</Heading>
            <Link href="/" passHref>
              <Clink color="green.200">@{school?.short_name}</Clink>
            </Link>
          </HStack>
          <Text>{school?.description}</Text>
        </chakra.div>
        {isAllowed && (
          <Link href="/school/configure/grade-section" passHref>
            <IconButton
              colorScheme="white"
              aria-label="school options"
              icon={<IoIosSettings />}
              variant="ghost"
            />
          </Link>
        )}
      </HStack>
    </Flex>
  );
}

export default School;
