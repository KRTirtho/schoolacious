import { Link as CLink, Flex } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import InviteMembersDrawer from "../components/InviteMembersDrawer";
import { INVITATION_OR_JOIN_ROLE } from "../configurations/titumir";

function SchoolConfigure() {
    return (
        <Flex align="center">
            <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.teacher} />
            <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.student} />
            <CLink color="primary.400" as={Link} to="/school/invitations">
                View Sent Invitations
            </CLink>
        </Flex>
    );
}

export default SchoolConfigure;
