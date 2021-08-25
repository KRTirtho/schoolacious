import {
    Avatar,
    chakra,
    HStack,
    IconButton,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import useTitumirMutation from "hooks/useTitumirMutation";
import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { CancelInvitationJoinBody } from "services/api/titumir";
import { Invitations_JoinsSchema } from "@veschool/types";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import { useAuthStore } from "state/authorization-store";

function SchoolInvitations() {
    const user = useAuthStore((s) => s.user);

    const { data: invitations } = useTitumirQuery<Invitations_JoinsSchema[]>(
        QueryContextKey.INVITATION_SENT,
        async (api) =>
            user?.school
                ? (await api.getSchoolInvitations(user.school.short_name)).json
                : [],
    );

    const queryClient = useQueryClient();

    const { mutate: cancelInvitationJoin } = useTitumirMutation<
        { message: string },
        CancelInvitationJoinBody
    >(
        MutationContextKey.CANCEL_INVITATION_JOIN,
        (api, data) => api.cancelInvitationJoin(data).then(({ json }) => json),
        {
            onSuccess() {
                queryClient.refetchQueries(QueryContextKey.INVITATION_SENT);
            },
        },
    );

    return (
        <chakra.div overflowX="auto">
            <Table variant="striped">
                <Thead>
                    <Tr>
                        <Th>Username</Th>
                        <Th>As</Th>
                        <Th>Date</Th>
                        <Th>Cancel</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {invitations?.map(({ user, created_at, role, _id }) => {
                        const username = `${user.first_name} ${user.last_name}`;
                        return (
                            <Tr key={user._id + created_at}>
                                <Td>
                                    <HStack>
                                        <Avatar name={username} size="sm" />
                                        <Text>{username}</Text>
                                    </HStack>
                                </Td>
                                <Td fontWeight="bold">{role}</Td>
                                <Td>
                                    {new Date(created_at)
                                        .toUTCString()
                                        .replace(" GMT", "")}
                                </Td>
                                <Td>
                                    <IconButton
                                        aria-label="cancel invitation"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() =>
                                            cancelInvitationJoin({
                                                _id,
                                            })
                                        }
                                    >
                                        <FaTimesCircle />
                                    </IconButton>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </chakra.div>
    );
}

export default SchoolInvitations;
