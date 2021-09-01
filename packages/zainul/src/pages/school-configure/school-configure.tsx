import { Stack } from "@chakra-ui/react";
import AddRemoveMembers from "pages/add-remove-members/add-remove-members";
import SchoolInvitations from "pages/school-invitations/school-invitations";
import SchoolJoinRequests from "pages/school-join-requests/school-join-requests";
import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import ConfigureGradeSection from "pages/configure-grade-section/configure-grade-section";
import NotFound404 from "routing/404";
import SchoolCoAdmins from "school-co_admins/school-co_admins";
import { Sidebar } from "components/Sidebar/Sidebar";

function SchoolConfigure() {
    const { path } = useRouteMatch();

    const links = [
        { to: "/co-admins", title: "Co-admins" },
        { to: "/add-remove-members", title: "Members" },
        { to: "/grade-sections", title: "Grades & Sections" },
        { to: "/invitations", title: "Invitations" },
        { to: "/join-requests", title: "Join Requests" },
    ];

    return (
        <Stack flexDir={["column", null, null, "row"]} align="flex-start">
            <Sidebar links={links} />
            <Stack flex={4} w="full" overflowX="auto">
                <Switch>
                    <Route exact path={path}>
                        <Redirect from={path} to={`${path}/grade-sections`} />
                    </Route>
                    <Route path={`${path}/co-admins`}>
                        <SchoolCoAdmins />
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
