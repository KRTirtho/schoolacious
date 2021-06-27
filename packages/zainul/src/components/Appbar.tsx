import React from "react";
import {
    IconButton,
    Flex,
    Heading,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import { IoIosNotifications, IoIosSunny, IoIosMoon, IoIosLogOut } from "react-icons/io";
import { RiUser3Line } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import useAuthorization from "../hooks/useAuthorization";

function Appbar() {
    const history = useHistory();

    const { toggleColorMode } = useColorMode();

    const SchemeToggleIcon = useColorModeValue(IoIosMoon, IoIosSunny);
    const colorMode = useColorModeValue("Dark", "Light");
    const { logout } = useAuthorization();

    return (
        <Flex
            direction="row"
            justify="space-between"
            alignItems="center"
            as="nav"
            p="1"
            pos="sticky"
        >
            <Heading onClick={() => history.push("/")} cursor="pointer" as="h5" size="lg">
                VESchool
            </Heading>
            {/* Action Button */}
            <Flex>
                <IconButton
                    variant="ghost"
                    aria-label="notifications button"
                    icon={<IoIosNotifications />}
                />

                <Menu isLazy>
                    <MenuButton as={IconButton} icon={<RiUser3Line />} variant="ghost" />
                    <MenuList>
                        <MenuItem
                            closeOnSelect={false}
                            icon={<SchemeToggleIcon />}
                            onClick={toggleColorMode}
                        >
                            {colorMode}
                        </MenuItem>
                        <MenuItem>Create a Copy</MenuItem>
                        <MenuItem>Mark as Draft</MenuItem>
                        <MenuItem>Delete</MenuItem>
                        <MenuItem onClick={logout} icon={<IoIosLogOut />}>
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    );
}

export default Appbar;
