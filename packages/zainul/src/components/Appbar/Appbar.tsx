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
    useTheme,
    theme as base,
} from "@chakra-ui/react";
import { IoIosNotifications, IoIosSunny, IoIosMoon, IoIosLogOut } from "react-icons/io";
import { RiUser3Line } from "react-icons/ri";
import { Link, useHistory } from "react-router-dom";
import { FaSchool, FaUserAlt } from "react-icons/fa";
import useLogout from "hooks/useLogout";
import { useAuthStore } from "state/authorization-store";
import useLoggedIn from "hooks/useLoggedIn";
import { BsGear } from "react-icons/bs";

function Appbar() {
    const history = useHistory();

    const { toggleColorMode } = useColorMode();
    const logout = useLogout();

    const theme = useTheme<typeof base>();

    const SchemeToggleIcon = useColorModeValue(IoIosMoon, IoIosSunny);
    const bg = useColorModeValue(theme.colors.gray[50], theme.colors.gray[700]);
    const colorMode = useColorModeValue("Dark", "Light");

    const school = useAuthStore((s) => s.user?.school);

    const loggedIn = useLoggedIn();

    if (!loggedIn) return <></>;

    return (
        <Flex
            bg={bg}
            direction="row"
            justify="space-between"
            align="center"
            pos="sticky"
            as="nav"
            p="1"
            zIndex="40000"
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
                        {school && (
                            <MenuItem as={Link} to="/school" icon={<FaSchool />}>
                                Your School
                            </MenuItem>
                        )}
                        <MenuItem as={Link} to={`/user/profile`} icon={<FaUserAlt />}>
                            Profile
                        </MenuItem>
                        <MenuItem
                            as={Link}
                            to={`/user/configure/invitations`}
                            icon={<BsGear />}
                        >
                            Settings
                        </MenuItem>
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
