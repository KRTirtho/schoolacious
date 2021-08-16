import { Heading, List, ListItem, Stack, Link as CLink } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import Paper from "../../components/Paper/Paper";
import { INVITATION_OR_JOIN_ROLE } from "../../services/api/titumir";
import InviteMembersDrawer from "./components/InviteMembersDrawer";

function AddRemoveMembers() {
    return (
        <Stack direction="row" spacing="2" justify="center" p="2" wrap="wrap">
            <Paper
                maxW={["full", null, "xl"]}
                shadow="none"
                colorScheme="tinted"
                py="2"
                m="0"
            >
                <Heading size="md">Configure Members</Heading>
                <List>
                    <ListItem>
                        <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.teacher} />
                    </ListItem>
                    <ListItem>
                        <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.student} />
                    </ListItem>
                    <ListItem>
                        <CLink color="primary.400" as={Link} to="/school/invitations">
                            View Sent Invitations
                        </CLink>
                    </ListItem>
                </List>
            </Paper>
        </Stack>
    );
}

export default AddRemoveMembers;
