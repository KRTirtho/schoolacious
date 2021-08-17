import {
    Flex,
    Heading,
    Box,
    Stack,
    Image,
    Link as Clink,
    Text,
    IconButton,
    Tooltip,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import React from "react";
import { FaSchool, FaUserPlus } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { Redirect, Link } from "react-router-dom";
import { useAuthStore } from "../../state/authorization-store";

function School() {
    const user = useAuthStore((s) => s.user);

    const school = user?.school;

    return (
        <Flex direction="column">
            <Box
                w="full"
                h="300px"
                bgPos="center"
                bgRepeat="no-repeat"
                bg="url(https://images.unsplash.com/photo-1560447992-466be70a0c49?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)"
            ></Box>
            <Stack direction={["column", "row"]} justify="space-between" p="2">
                <Stack
                    align={{ base: "center", md: "flex-start" }}
                    transform="translateY(-50%)"
                >
                    <Image
                        boxSize="8rem"
                        rounded="sm"
                        src="https://images.unsplash.com/photo-1560447992-466be70a0c49?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    />
                    <Heading size="lg">{school?.name}</Heading>
                    {school === undefined && <Redirect to="/school/create" />}
                    <Clink color="green.200" as={Link} to="/">
                        @{school?.short_name}
                    </Clink>
                    <Text>{school?.description}</Text>
                </Stack>
                <Menu isLazy>
                    <Tooltip label="School Configuration Options">
                        <MenuButton
                            colorScheme="white"
                            aria-label="school options"
                            as={IconButton}
                            icon={<IoIosSettings />}
                            variant="ghost"
                        />
                    </Tooltip>
                    <MenuList>
                        <MenuItem
                            as={Link}
                            to="/school/configure-members"
                            icon={<FaUserPlus />}
                        >
                            Add/Remove members
                        </MenuItem>
                        <MenuItem
                            as={Link}
                            to="/school/configure-school"
                            icon={<FaSchool />}
                        >
                            Configure school
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Stack>
        </Flex>
    );
}

export default School;
