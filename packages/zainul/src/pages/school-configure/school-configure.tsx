import {
    Link as CLink,
    Heading,
    List,
    ListItem,
    Stack,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import InviteMembersDrawer from "./components/InviteMembersDrawer";
import { INVITATION_OR_JOIN_ROLE } from "@veschool/types";
import Paper from "../../components/Paper/Paper";
import AddGradesModal from "./components/AddGradesModal";
import GradesList from "./components/GradesList";

function SchoolConfigure() {
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

            <Paper maxW={["full", null, "xl"]} shadow="none" colorScheme="tinted" py="2">
                <Heading size="md">Grade Configurations</Heading>
                <AddGradesModal />
                <GradesList />
            </Paper>

            <GradeSectionTable />
        </Stack>
    );
}

export default SchoolConfigure;

function GradeSectionTable() {
    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>1</Th>
                    <Th>2</Th>
                    <Th>3</Th>
                    <Th>4</Th>
                    <Th>5</Th>
                    <Th>6</Th>
                    <Th>8</Th>
                    <Th>7</Th>
                    <Th>9</Th>
                    <Th>10</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>A</Td>
                </Tr>
                <Tr>
                    <Td>B</Td>
                </Tr>
                <Tr>
                    <Td>C</Td>
                </Tr>
                <Tr>
                    <Td>D</Td>
                </Tr>
                <Tr>
                    <Td>E</Td>
                </Tr>
                <Tr>
                    <Td>F</Td>
                </Tr>
                <Tr>
                    <Td>G</Td>
                </Tr>
                <Tr>
                    <Td>H</Td>
                </Tr>
                <Tr>
                    <Td>I</Td>
                </Tr>
                <Tr>
                    <Td>J</Td>
                </Tr>
            </Tbody>
        </Table>
    );
}
