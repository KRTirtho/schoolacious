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
    theme,
} from "@chakra-ui/react";
import { IoIosNotifications, IoIosSunny, IoIosMoon, IoIosLogOut } from "react-icons/io";
import { RiUser3Line } from "react-icons/ri";
import { Link, useHistory } from "react-router-dom";
import useAuthorization from "../hooks/useAuthorization";
import { FaSchool } from "react-icons/fa";

function Appbar() {
    const history = useHistory();

    const { toggleColorMode } = useColorMode();

    const SchemeToggleIcon = useColorModeValue(IoIosMoon, IoIosSunny);
    const bg = useColorModeValue(theme.colors.gray[50], theme.colors.gray[700]);
    const colorMode = useColorModeValue("Dark", "Light");
    const { logout } = useAuthorization();

    return (
        <Flex
            bg={bg}
            direction="row"
            justify="space-between"
            align="center"
            pos="sticky"
            as="nav"
            p="1"
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
                        <MenuItem as={Link} to="/school" icon={<FaSchool />}>
                            Your School
                        </MenuItem>
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
