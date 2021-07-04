import { HStack, List, Text } from "@chakra-ui/react";
import React from "react";
import { Redirect } from "react-router-dom";
import ListAvatarTile from "../../components/ListAvatarTile/ListAvatarTile";
import { QueryContextKey } from "../../configs/enums";
import useTitumirQuery from "../../hooks/useTitumirQuery";
import { useAuthStore } from "../../state/authorization-store";

export interface InvitationsProps {
    platform: "school" | "user";
}

function Invitations(props: InvitationsProps) {
    const user = useAuthStore((s) => s.user);

    const { data: invitations } = useTitumirQuery(
        QueryContextKey.INVITATION_SENT,
        async (api) =>
            user?.school
                ? (await api.getSchoolInvitations(user.school.short_name)).json
                : [],
    );

    return (
        <List>
            {!user?.school && <Redirect to="/" />}
            {invitations?.map(
                ({ _id, role, user: { first_name, last_name }, created_at }) => (
                    <ListAvatarTile
                        key={_id}
                        name={[first_name, last_name]}
                        spacing="5"
                        ending={
                            <HStack spacing="5">
                                <Text color="gray.500">{role}</Text>
                                <Text color="gray.500">
                                    {new Date(created_at)
                                        .toUTCString()
                                        .replace(" GMT", "")}
                                </Text>
                            </HStack>
                        }
                    />
                ),
            )}
        </List>
    );
}

export default Invitations;
