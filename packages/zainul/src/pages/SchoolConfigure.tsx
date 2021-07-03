import { Flex } from "@chakra-ui/react";
import React from "react";
import InviteMembersDrawer from "../components/InviteMembersDrawer";
import { INVITATION_OR_JOIN_ROLE } from "../configurations/titumir";

function SchoolConfigure() {
    return (
        <Flex>
            <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.teacher} />
            <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.student} />
        </Flex>
    );
}

export default SchoolConfigure;
