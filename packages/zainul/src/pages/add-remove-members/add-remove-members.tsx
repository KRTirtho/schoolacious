import {
    Heading,
    List,
    ListItem,
    Stack,
    Text,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    HStack,
    InputGroup,
    InputLeftElement,
    Input,
} from "@chakra-ui/react";
import React from "react";
import Paper from "components/Paper/Paper";
import InviteMembersDrawer from "./components/InviteMembersDrawer";
import ListAvatarTile from "components/ListAvatarTile/ListAvatarTile";
import useTitumirQuery from "hooks/useTitumirQuery";
import { QueryContextKey } from "configs/enums";
import { INVITATION_OR_JOIN_ROLE, UserSchema } from "@schoolacious/types";
import { FaEllipsisH, FaSearch } from "react-icons/fa";
import { userToName } from "utils/userToName";

function AddRemoveMembers() {
    const { data: members } = useTitumirQuery<UserSchema[]>(
        QueryContextKey.SCHOOL_MEMBERS,
        async (api) => {
            const { json } = await api.school.listMembers();
            return json;
        },
    );

    const memberOptions = (
        <Menu>
            <MenuButton as={IconButton} variant="ghost" icon={<FaEllipsisH />} />

            <MenuList>
                <MenuItem>Remove</MenuItem>
                <MenuItem>Modify</MenuItem>
            </MenuList>
        </Menu>
    );

    return (
        <Stack direction="column" spacing="2" p="2" wrap="wrap">
            <Paper
                maxW={["full", null, "xl"]}
                shadow="none"
                colorScheme="tinted"
                py="2"
                m="0"
                alignSelf="center"
            >
                <Heading size="md">Configure Members</Heading>
                <List>
                    <ListItem>
                        <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.teacher} />
                    </ListItem>
                    <ListItem>
                        <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.student} />
                    </ListItem>
                </List>
            </Paper>
            <HStack justify="space-between">
                <Heading size="md">Members</Heading>
                <InputGroup maxW="xs">
                    <InputLeftElement>
                        <FaSearch />
                    </InputLeftElement>
                    <Input
                        type="search"
                        name="search"
                        placeholder="Search Members"
                        required
                    />
                </InputGroup>
            </HStack>
            <List>
                {members?.map(({ _id, first_name, last_name, role }, i) => (
                    <ListAvatarTile
                        key={_id + i}
                        to={`/user/profile/${_id}`}
                        name={userToName({ first_name, last_name })}
                        ending={memberOptions}
                    >
                        <Text color="gray">[{role?.valueOf()}]</Text>
                    </ListAvatarTile>
                ))}
            </List>
        </Stack>
    );
}

export default AddRemoveMembers;
