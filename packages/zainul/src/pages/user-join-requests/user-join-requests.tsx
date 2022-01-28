import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import React from "react";
import { Invitations_JoinsSchema } from "@schoolacious/types";
import { chakra, Table, Thead, Tr, Th, Tbody } from "@chakra-ui/react";
import TableRowTile from "components/TableRowTile/TableRowTile";
import useTitumirMutation from "hooks/useTitumirMutation";
import { InvitationJoinCancellationProperties } from "services/titumir-client/modules/invitation-join";

function UserJoinRequests() {
    const { data: joinRequests, refetch } = useTitumirQuery<Invitations_JoinsSchema[]>(
        QueryContextKey.JOIN_REQUEST_SENT,
        (api) => api.user.listJoinRequest().then(({ json }) => json),
    );

    const { mutate: cancelInvitationJoin } = useTitumirMutation<
        { message: string },
        InvitationJoinCancellationProperties
    >(
        MutationContextKey.CANCEL_INVITATION_JOIN,
        (api, data) => api.invitationJoin.cancel(data).then(({ json }) => json),
        {
            onSuccess: () => refetch(),
        },
    );

    return (
        <chakra.div overflowX="auto">
            <Table variant="striped">
                <Thead>
                    <Tr>
                        <Th>School Name</Th>
                        <Th>As</Th>
                        <Th>Date</Th>
                        <Th>Cancel</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {joinRequests?.map(({ school, created_at, role, _id }) => {
                        return (
                            <TableRowTile
                                action-variant="cancel"
                                button-labels="Cancel Join Requests"
                                key={_id + created_at}
                                heading={school.name}
                                middle={role}
                                date={created_at}
                                onFirstButtonClick={() =>
                                    cancelInvitationJoin({
                                        _id,
                                    })
                                }
                            />
                        );
                    })}
                </Tbody>
            </Table>
        </chakra.div>
    );
}

export default UserJoinRequests;
