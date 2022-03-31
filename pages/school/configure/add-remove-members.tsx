import React from 'react';
import { NextLayoutPage } from 'pages/_app';
import { Sidebar } from 'components/pages/school/configure/Sidebar';
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Stack,
  Heading,
  List,
  ListItem,
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  Text,
} from '@chakra-ui/react';
import ListAvatarTile from 'components/shared/ListAvatarTile/ListAvatarTile';
import Paper from 'components/shared/Paper/Paper';
import { QueryContextKey } from 'configs/enums';
import { FaEllipsisH, FaSearch } from 'react-icons/fa';
import { RoleSchema, titumir, UserSchema } from 'services/titumir';
import { useQuery } from 'react-query';
import { useUserMeta } from 'services/titumir-hooks/useUserMeta';
import { userToName } from 'utils/user-to-name';

export interface RoleUserSchema extends Omit<UserSchema, 'role_id'> {
  roles?: RoleSchema[];
}

const ManageMembers: NextLayoutPage = () => {
  const me = useUserMeta();
  const { data: members } = useQuery<RoleUserSchema[] | null | undefined>(
    QueryContextKey.SCHOOL_MEMBERS,
    () =>
      titumir.user
        .list({
          columns: '*, roles(*)',
          eq: { school_id: me.data?.school?.id },
        })
        .then((s) => s.body)
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
        maxW={['full', null, 'xl']}
        shadow="none"
        colorScheme="tinted"
        py="2"
        m="0"
        alignSelf="center"
      >
        <Heading size="md" textAlign="center">
          Configure Members
        </Heading>
        <List>
          {/* <ListItem>
            <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.teacher} />
          </ListItem>
          <ListItem>
            <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.student} />
          </ListItem> */}
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
        {members?.map((user, i) => (
          <ListAvatarTile
            key={user.id + i}
            to={`/user/profile/${user.id}`}
            name={userToName(user)}
            ending={memberOptions}
          >
            <Text color="gray">{JSON.stringify(user)}</Text>
          </ListAvatarTile>
        ))}
      </List>
    </Stack>
  );
};

ManageMembers.getLayout = (page) => {
  return <Sidebar>{page}</Sidebar>;
};

export default ManageMembers;
