import { Stack } from "@chakra-ui/react";
import { Sidebar } from "components/Sidebar/Sidebar";
import UserInvitations from "pages/user-invitations/user-invitations";
import UserJoinRequests from "pages/user-join-requests/user-join-requests";
import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import NotFound404 from "routing/404";

function UserConfigure() {
    const { path } = useRouteMatch();

    const links = [
        { to: path + "/invitations", title: "Received Invitations" },
        { to: path + "/join-requests", title: "Sent Join Requests" },
    ];

    return (
        <Stack flexDir={["column", null, null, "row"]} align="flex-start">
            <Sidebar links={links} />
            <Stack flex={4} w="full" overflowX="auto">
                <Switch>
                    <Route exact path={path}>
                        <Redirect from={path} to={`${path}/invitations`} />
                    </Route>
                    <Route path={`${path}/invitations`}>
                        <UserInvitations />
                    </Route>
                    <Route path={`${path}/join-requests`}>
                        <UserJoinRequests />
                    </Route>
                    <Route path="*">
                        <NotFound404 />
                    </Route>
                </Switch>
            </Stack>
        </Stack>
    );
}

export default UserConfigure;
