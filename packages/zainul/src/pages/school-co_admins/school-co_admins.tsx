import React from "react";
import { List, ListItem, Text } from "@chakra-ui/react";
import { SchoolSchema, USER_ROLE } from "@veschool/types";
import { AddUserPopover } from "components/AddUserPopover/AddUserPopover";
import Paper from "components/Paper/Paper";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import { useAuthStore } from "state/authorization-store";
import { userToName } from "utils/userToName";
import useTitumirMutation from "hooks/useTitumirMutation";
import { AddCoAdminProperties } from "services/titumir-api/modules/school";
import { usePermissions } from "hooks/usePermissions";

function SchoolCoAdmins() {
    const short_name = useAuthStore((s) => s.user?.school?.short_name);

    const { data: school, refetch } = useTitumirQuery<SchoolSchema | null>(
        QueryContextKey.SCHOOL,
        async (api) => {
            if (!short_name) return null;
            const { json } = await api.school.get(short_name);
            return json;
        },
    );

    const isAllowed = usePermissions([USER_ROLE.admin]);

    const { mutate: assignCoAdmins } = useTitumirMutation<
        SchoolSchema | null,
        AddCoAdminProperties
    >(
        MutationContextKey.ASSIGN_CO_ADMINS,
        async (api, data) => {
            if (!isAllowed) return null;
            const { json } = await api.school.addCoAdmin(data);
            return json;
        },
        {
            onSuccess: () => refetch(),
        },
    );

    return (
        <Paper>
            <List>
                <ListItem p="2" fontWeight="semibold">
                    Co Admin 1:{" "}
                    <Text color={!school?.coAdmin1 ? "red.500" : ""} as="span">
                        {userToName(school?.coAdmin1)}
                    </Text>
                    {isAllowed && (
                        <AddUserPopover
                            name="coAdmin1"
                            onSubmit={(value, { resetForm, setSubmitting }, onClose) => {
                                assignCoAdmins(
                                    { email: value.coAdmin1 as string, index: 1 },
                                    {
                                        onSuccess() {
                                            setSubmitting(false);
                                            resetForm();
                                            onClose();
                                        },
                                        onError() {
                                            setSubmitting(false);
                                        },
                                    },
                                );
                            }}
                            placeholder="Search for co-admin..."
                            heading="Add Co-admin 1"
                            label="Co-admin"
                        />
                    )}
                </ListItem>
                <ListItem p="2" fontWeight="semibold">
                    Co Admin 2:{" "}
                    <Text color={!school?.coAdmin2 ? "red.500" : ""} as="span">
                        {userToName(school?.coAdmin2)}
                    </Text>
                    {isAllowed && (
                        <AddUserPopover
                            name="coAdmin2"
                            placeholder="Search for co-admin..."
                            heading="Add Co-admin 2"
                            label="Co-admin"
                            onSubmit={(value, { resetForm, setSubmitting }) => {
                                assignCoAdmins(
                                    { email: value.coAdmin2 as string, index: 2 },
                                    {
                                        onSuccess() {
                                            setSubmitting(false);
                                            resetForm();
                                        },
                                        onError() {
                                            setSubmitting(false);
                                        },
                                    },
                                );
                            }}
                        />
                    )}
                </ListItem>
            </List>
        </Paper>
    );
}

export default SchoolCoAdmins;
