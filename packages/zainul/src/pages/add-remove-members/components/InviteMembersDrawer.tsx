import React, { useMemo } from "react";
import { OptionTypeBase } from "react-select";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import {
    InvitationBody,
    Invitations_Joins,
    INVITATION_OR_JOIN_ROLE,
} from "services/api/titumir";
import useTitumirMutation from "hooks/useTitumirMutation";
import { useQueryClient } from "react-query";
import { capitalize } from "lodash-es";
import AddMultipleUserSlide from "components/AddMultipleUserSlide/AddMultipleUserSlide";

export interface OptionType extends OptionTypeBase {
    label: React.ReactElement;
    labelStr: string;
    value: string;
}

interface InviteMembersDrawerProps {
    role: INVITATION_OR_JOIN_ROLE;
}

function InviteMembersDrawer({ role }: InviteMembersDrawerProps) {
    const queryClient = useQueryClient();

    const { mutate: invite } = useTitumirMutation<Invitations_Joins[], InvitationBody[]>(
        MutationContextKey.INVITATION,
        (api, invitations) => api.invite(invitations).then(({ json }) => json),
    );

    const character = useMemo(() => capitalize(role.valueOf()), [role]);
    return (
        <AddMultipleUserSlide
            triggerTitle={`Invite ${character}s`}
            heading={`Invite ${character}s`}
            placeholder={`Search ${character}s..`}
            onSubmit={(selections, handleClose) => {
                invite(
                    selections.map(({ value }) => ({
                        user_id: value,
                        role,
                    })),
                    {
                        onSuccess() {
                            queryClient
                                .resetQueries(QueryContextKey.QUERY_USER, { exact: true })
                                .then(() => {
                                    handleClose();
                                })
                                .catch((e) => console.error(e));
                        },
                    },
                );
            }}
        />
    );
}

export default InviteMembersDrawer;
