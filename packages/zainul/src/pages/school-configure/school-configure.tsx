import {
    Button,
    List,
    ListItem,
    ListItemProps,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    useBreakpoint,
    useColorModeValue,
} from "@chakra-ui/react";
import AddRemoveMembers from "pages/add-remove-members/add-remove-members";
import SchoolInvitations from "pages/school-invitations/school-invitations";
import SchoolJoinRequests from "pages/school-join-requests/school-join-requests";
import React, { FC, useEffect, useState } from "react";
import {
    Link,
    LinkProps,
    Redirect,
    Route,
    Switch,
    useLocation,
    useRouteMatch,
} from "react-router-dom";
import ConfigureGradeSection from "pages/configure-grade-section/configure-grade-section";
import NotFound404 from "routing/404";
import { FaCaretDown } from "react-icons/fa";

const SidebarItem: FC<ListItemProps & LinkProps> = (props) => {
    const location = useLocation();
    const bg = useColorModeValue("gray.50", "gray.700");
    const borderBottomColor = useColorModeValue("gray.300", "gray.600");

    const isActive = props.to === location.pathname;
    return (
        <ListItem
            bg={bg}
            as={Link}
            p="3"
            borderRight={isActive ? "solid 5px" : ""}
            borderColor={isActive ? "green.500" : ""}
            _hover={{
                filter: "brightness(90%)",
            }}
            _active={{
                filter: "brightness(95%)",
            }}
            _first={{
                borderTopLeftRadius: "md",
            }}
            _last={{
                borderBottomLeftRadius: "md",
            }}
            _notLast={{
                borderBottom: "1px solid",
                borderBottomColor,
            }}
            fontWeight="bold"
            {...props}
        />
    );
};

function SchoolConfigure() {
    const { path } = useRouteMatch();
    const screen = useBreakpoint();
    const [selectedRoute, setSelectedRoute] = useState("");

    const links = [
        { to: "/co-admins", title: "Co-admins" },
        { to: "/add-remove-members", title: "Members" },
        { to: "/grade-sections", title: "Grades & Sections" },
        { to: "/invitations", title: "Invitations" },
        { to: "/join-requests", title: "Join Requests" },
    ];

    const location = useLocation();

    useEffect(() => {
        const currentRoute = links.find((link) => path + link.to === location.pathname);
        if (currentRoute) setSelectedRoute(currentRoute.title);
    }, [location.pathname]);

    const isLargeScreen = screen && !["md", "sm", "base"].includes(screen);
    return (
        <Stack flexDir={["column", null, null, "row"]} align="flex-start">
            {isLargeScreen ? (
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
            )}
            <Stack flex={4} w="full" overflowX="auto">
                <Switch>
                    <Route exact path={path}>
                        <Redirect from={path} to={`${path}/grade-sections`} />
                    </Route>
                    <Route path={`${path}/grade-sections`}>
                        <ConfigureGradeSection />
                    </Route>
                    <Route path={`${path}/add-remove-members`}>
                        <AddRemoveMembers />
                    </Route>
                    <Route path={`${path}/invitations`}>
                        <SchoolInvitations />
                    </Route>
                    <Route path={`${path}/join-requests`}>
                        <SchoolJoinRequests />
                    </Route>
                    <Route path="*">
                        <NotFound404 />
                    </Route>
                </Switch>
            </Stack>
        </Stack>
    );
}

export default SchoolConfigure;
