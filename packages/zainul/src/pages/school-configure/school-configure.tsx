import { Stack } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "components/Sidebar/Sidebar";

function SchoolConfigure() {
    const links = [
        { to: `co-admins`, title: "Co-admins" },
        { to: `add-remove-members`, title: "Members" },
        {
            to: `grade-sections`,
            title: "Grades & Sections",
        },
        { to: `subjects`, title: "Subjects" },
        { to: `invitations`, title: "Invitations" },
        { to: `join-requests`, title: "Join Requests" },
    ];

    return (
        <Stack flexDir={["column", null, null, "row"]} align="flex-start">
            <Sidebar links={links} />
            <Stack flex={4} w="full" overflowX="auto">
                <Outlet />
            </Stack>
        </Stack>
    );
}

export default SchoolConfigure;
