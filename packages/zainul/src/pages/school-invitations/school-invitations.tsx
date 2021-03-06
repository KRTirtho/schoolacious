import { chakra, Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import useTitumirMutation from "hooks/useTitumirMutation";
import React from "react";
import { useQueryClient } from "react-query";
import { InvitationJoinCancellationProperties } from "services/titumir-client/modules/invitation-join";
import { Invitations_JoinsSchema } from "@schoolacious/types";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import { useAuthStore } from "state/authorization-store";
import TableRowTile from "components/TableRowTile/TableRowTile";

function SchoolInvitations() {
    const user = useAuthStore((s) => s.user);

    const { data: invitations } = useTitumirQuery<Invitations_JoinsSchema[]>(
        QueryContextKey.INVITATION_SENT,
        async (api) => (user?.school ? (await api.school.listInvitations()).json : []),
    );

    const queryClient = useQueryClient();

    const { mutate: cancelInvitationJoin } = useTitumirMutation<
        { message: string },
        InvitationJoinCancellationProperties
    >(
        MutationContextKey.CANCEL_INVITATION_JOIN,
        (api, data) => api.invitationJoin.cancel(data).then(({ json }) => json),
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
                            <TableRowTile
                                button-labels="Cancel invitation"
                                heading={username}
                                date={created_at}
                                middle={role}
                                onFirstButtonClick={() =>
                                    cancelInvitationJoin({
                                        _id,
                                    })
                                }
                                key={user._id + created_at}
                            />
                        );
                    })}
                </Tbody>
            </Table>
        </chakra.div>
    );
}

export default SchoolInvitations;
