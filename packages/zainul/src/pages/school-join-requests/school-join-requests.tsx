import { chakra, Table, Thead, Tr, Th, Tbody } from "@chakra-ui/react";
import TableRowTile from "components/TableRowTile/TableRowTile";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirMutation from "hooks/useTitumirMutation";
import useTitumirQuery from "hooks/useTitumirQuery";
import React from "react";
import {
    CompleteInvitationJoinBody,
    INVITATION_OR_JOIN_ACTION,
} from "services/api/titumir";
import { Invitations_JoinsSchema } from "@veschool/types";
import { useAuthStore } from "state/authorization-store";
import { userToName } from "utils/userToName";

function SchoolJoinRequests() {
    const short_name = useAuthStore((s) => s.user?.school?.short_name);

    const { data: invitations, refetch } = useTitumirQuery<
        Invitations_JoinsSchema[] | null
    >(QueryContextKey.JOIN_REQUEST_RECEIVED, async (api) => {
        if (!short_name) return null;
        const { json } = await api.getSchoolJoinRequests(short_name);
        return json;
    });

    const { mutate: completeInvitationJoin } = useTitumirMutation<
        { message: string },
        CompleteInvitationJoinBody
    >(
        MutationContextKey.COMPLETE_INVITATION_JOIN,
        (api, data) => api.completeInvitationJoin(data).then(({ json }) => json),
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

export default SchoolJoinRequests;
