import {
    Button,
    List,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useBreakpoint,
} from "@chakra-ui/react";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import { SidebarItem } from "./SidebarItem";

export interface SidebarProps {
    links: { to: string; title: string | ReactElement; icon?: ReactElement }[];
}

export const Sidebar: FC<SidebarProps> = ({ links }) => {
    const location = useLocation();

    const [selectedRoute, setSelectedRoute] = useState<string | ReactElement>("");

    const screen = useBreakpoint();

    const { path } = useRouteMatch();

    useEffect(() => {
        const currentRoute = links.find((link) => path + link.to === location.pathname);
        if (currentRoute) setSelectedRoute(currentRoute.title);
    }, [location.pathname]);

    const isLargeScreen = screen && !["md", "sm", "base"].includes(screen);

    return isLargeScreen ? (
        <List display="flex" flexDir="column" m="5" borderRadius="md" flex={1}>
            {links.map(({ to, title }, i) => (
                <SidebarItem key={to + i} to={path + to}>
                    {title}
                </SidebarItem>
            ))}
        </List>
    ) : (
        <Menu flip>
            <MenuButton
                ml="3"
                mt="3"
                as={Button}
                colorScheme="gray"
                rightIcon={<FaCaretDown />}
            >
                {"Tab - " + selectedRoute || "Tabs"}
            </MenuButton>
            <MenuList>
                {links.map(({ title, to }, i) => (
                    <MenuItem key={to + i} as={Link} to={path + to}>
                        {title}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};
