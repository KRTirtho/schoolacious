import React from "react";
import { chakra, Table, Thead, Tr, Th, Tbody, useToast } from "@chakra-ui/react";
import TableRowTile from "components/TableRowTile/TableRowTile";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirMutation from "hooks/useTitumirMutation";
import useTitumirQuery from "hooks/useTitumirQuery";
import {
    InvitationJoinCompletionProperties,
    INVITATION_OR_JOIN_ACTION,
} from "services/titumir-api/modules/invitation-join";
import { Invitations_JoinsSchema } from "@veschool/types";
import { userToName } from "utils/userToName";

function SchoolJoinRequests() {
    const { data: invitations, refetch } = useTitumirQuery<Invitations_JoinsSchema[]>(
        QueryContextKey.JOIN_REQUEST_RECEIVED,
        async (api) => {
            const { json } = await api.school.listJoinRequests();
            return json;
        },
    );

    const { mutate: completeInvitationJoin, error } = useTitumirMutation<
        { message: string },
        InvitationJoinCompletionProperties
    >(
        MutationContextKey.COMPLETE_INVITATION_JOIN,
        (api, data) => api.invitationJoin.complete(data).then(({ json }) => json),
        {
            onSuccess: () => refetch(),
        },
    );

    const toast = useToast({ isClosable: true, variant: "solid", position: "bottom" });

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
                    {invitations?.map(({ created_at, role, _id, user }) => {
                        const username = userToName(user);

                        return (
                            <TableRowTile
                                action-variant="accept-decline"
                                button-labels={[
                                    "Decline join request",
                                    "Accept join request",
                                ]}
                                key={_id + created_at}
                                heading={username}
                                middle={role}
                                date={created_at}
                                onFirstButtonClick={() => {
                                    completeInvitationJoin(
                                        {
                                            _id,
                                            action: INVITATION_OR_JOIN_ACTION.reject,
                                        },
                                        {
                                            onSuccess() {
                                                toast({
                                                    title: "Cancelled Join Request",
                                                    description: `${username}'s is removed from join list'`,
                                                });
                                            },
                                            onError() {
                                                toast({
                                                    title: "Failed to cancel join request",
                                                    description: error?.message,
                                                    status: "error",
                                                });
                                            },
                                        },
                                    );
                                }}
                                onSecondButtonClick={() => {
                                    completeInvitationJoin(
                                        {
                                            _id,
                                            action: INVITATION_OR_JOIN_ACTION.accept,
                                        },
                                        {
                                            onSuccess() {
                                                toast({
                                                    title: "Accepted Join Request",
                                                    description: `${username}'s is added as a ${role}`,
                                                    status: "success",
                                                });
                                            },
                                            onError() {
                                                toast({
                                                    title: "Failed to accept join request",
                                                    description: error?.message,
                                                    status: "error",
                                                });
                                            },
                                        },
                                    );
                                }}
                            />
                        );
                    })}
                </Tbody>
            </Table>
        </chakra.div>
    );
}

export default SchoolJoinRequests;
