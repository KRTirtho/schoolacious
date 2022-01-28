import { Table, Thead, Tr, Th, Tbody, chakra } from "@chakra-ui/react";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import React from "react";
import { Invitations_JoinsSchema } from "@schoolacious/types";
import useTitumirMutation from "hooks/useTitumirMutation";
import {
    InvitationJoinCompletionProperties,
    INVITATION_OR_JOIN_ACTION,
} from "services/titumir-client/modules/invitation-join";
import TableRowTile from "components/TableRowTile/TableRowTile";

function UserInvitations() {
    const { data: invitations, refetch } = useTitumirQuery<Invitations_JoinsSchema[]>(
        QueryContextKey.INVITATION_RECEIVED,
        (api) => api.user.listInvitation().then(({ json }) => json),
    );

    const { mutate: completeInvitationJoin } = useTitumirMutation<
        { message: string },
        InvitationJoinCompletionProperties
    >(
        MutationContextKey.COMPLETE_INVITATION_JOIN,
        (api, data) => api.invitationJoin.complete(data).then(({ json }) => json),
        {
            onSuccess() {
                refetch();
            },
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
                        <Th>Decline</Th>
                        <Th>Accept</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {invitations?.map(({ school, created_at, role, _id }) => {
                        return (
                            <TableRowTile
                                action-variant="accept-decline"
                                button-labels={[
                                    "Decline invitation",
                                    "Accept Invitation",
                                ]}
                                key={_id + created_at}
                                heading={school.name}
                                middle={role}
                                date={created_at}
                                onFirstButtonClick={() =>
                                    completeInvitationJoin({
                                        _id,
                                        action: INVITATION_OR_JOIN_ACTION.reject,
                                    })
                                }
                                onSecondButtonClick={() =>
                                    completeInvitationJoin({
                                        _id,
                                        action: INVITATION_OR_JOIN_ACTION.accept,
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

export default UserInvitations;
