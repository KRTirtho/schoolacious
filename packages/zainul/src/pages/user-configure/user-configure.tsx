import { Stack } from "@chakra-ui/react";
import { Sidebar } from "components/Sidebar/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

function UserConfigure() {
    const links = [
        { to: "invitations", title: "Received Invitations" },
        { to: "join-requests", title: "Sent Join Requests" },
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

export default UserConfigure;
