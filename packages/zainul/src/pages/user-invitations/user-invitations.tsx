import {
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    HStack,
    Avatar,
    IconButton,
    Text,
    chakra,
} from "@chakra-ui/react";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Invitations_JoinsSchema } from "@veschool/types";
import useTitumirMutation from "hooks/useTitumirMutation";
import {
    CompleteInvitationJoinBody,
    INVITATION_OR_JOIN_ACTION,
} from "services/api/titumir";

function UserInvitations() {
    const { data: invitations, refetch } = useTitumirQuery<Invitations_JoinsSchema[]>(
        QueryContextKey.INVITATION_RECEIVED,
        (api) => api.getUserInvitations().then(({ json }) => json),
    );

    const { mutate: completeInvitationJoin } = useTitumirMutation<
        { message: string },
        CompleteInvitationJoinBody
    >(
        MutationContextKey.COMPLETE_INVITATION_JOIN,
        (api, data) => api.completeInvitationJoin(data).then(({ json }) => json),
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
                            <Tr key={_id + created_at}>
                                <Td>
                                    <HStack>
                                        <Avatar name={school.name} size="sm" />
                                        <Text>{school.name}</Text>
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
                                        aria-label="Decline invitation"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() =>
                                            completeInvitationJoin({
                                                _id,
                                                action: INVITATION_OR_JOIN_ACTION.reject,
                                            })
                                        }
                                    >
                                        <FaTimesCircle />
                                    </IconButton>
                                </Td>
                                <Td>
                                    <IconButton
                                        aria-label="Accept invitation"
                                        variant="ghost"
                                        colorScheme="green"
                                        onClick={() =>
                                            completeInvitationJoin({
                                                _id,
                                                action: INVITATION_OR_JOIN_ACTION.accept,
                                            })
                                        }
                                    >
                                        <FaCheckCircle />
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

export default UserInvitations;
