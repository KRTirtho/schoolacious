import { Image, Button, Text, Stack, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaSchool, FaUserGraduate } from 'react-icons/fa';
import Link from 'next/link';

function NoSchool() {
  return (
    <VStack flex={1} alignItems="center" justify="center" spacing="10">
      <Image
        maxW="15rem"
        h="auto"
        src="/assets/404-confused-kid.png"
        draggable={false}
        alt="Don't be alone"
      />
      <Text my="5" color="textSecondary" variant="h6">
        You haven&apos;t joined a school yet
      </Text>
      <Stack flexDir={['column', null, 'row']} spacing="2">
        <Link href="/school/create" passHref>
          <Button
            variant="outline"
            leftIcon={<FaSchool />}
            isFullWidth
            mr={[null, null, '2']}
            mb={['2', null, null]}
          >
            Create a School
          </Button>
        </Link>
        <Link href="/school/join" passHref>
          <Button
            style={{
              margin: 0,
            }}
            variant="outline"
            rightIcon={<FaUserGraduate />}
            isFullWidth
          >
            Join a School
          </Button>
        </Link>
      </Stack>
    </VStack>
  );
}

export default NoSchool;
