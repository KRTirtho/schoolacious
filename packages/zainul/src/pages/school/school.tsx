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
} from "@chakra-ui/react";
import { usePermissions } from "hooks/usePermissions";
import React from "react";
import { IoIosSettings } from "react-icons/io";
import { Redirect, Link } from "react-router-dom";
import { useAuthStore } from "state/authorization-store";
import { USER_ROLE } from "@veschool/types";

function School() {
    const school = useAuthStore((s) => s.user?.school);

    const isAllowed = usePermissions([USER_ROLE.admin, USER_ROLE.coAdmin]);

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
                    />
                    <HStack>
                        <Heading size="lg">{school?.name}</Heading>
                        {school === undefined && <Redirect to="/school/create" />}
                        <Clink color="green.200" as={Link} to="/">
                            @{school?.short_name}
                        </Clink>
                    </HStack>
                    <Text>{school?.description}</Text>
                </chakra.div>
                {isAllowed && (
                    <IconButton
                        as={Link}
                        colorScheme="white"
                        aria-label="school options"
                        icon={<IoIosSettings />}
                        variant="ghost"
                        to="/school/configure/grade-sections"
                    />
                )}
            </HStack>
        </Flex>
    );
}

export default School;
