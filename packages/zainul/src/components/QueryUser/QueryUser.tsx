import React, { useEffect, useMemo } from "react";
import { UserSchema, USER_ROLE } from "@veschool/types";
import { QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import { TextFieldProps } from "components/TextField/TextField";
import { useQueryClient } from "react-query";
import { useAuthStore } from "state/authorization-store";
import { CUIAutocomplete } from "components/CUIAutocomplete/CUIAutocomplete";

export interface QueryUserProps extends TextFieldProps {
    /**
     * `_id` of the users that will be ignored
     */
    filterUsers?: string[] | null;
    roles?: USER_ROLE[];
}

function QueryUser({
    filterUsers,
    roles = [USER_ROLE.teacher],
    ...props
}: QueryUserProps) {
    const query = props.field?.value;
    const school = useAuthStore((s) => s.user?.school);

    const { data: optionsRaw, refetch } = useTitumirQuery<UserSchema[]>(
        [QueryContextKey.QUERY_USER, props.field.name],
        (api) =>
            api.user
                .query(query, { school_id: school?._id, roles })
                .then(({ json }) => json),
        {
            enabled: false,
            initialData: [],
        },
    );

    const queryClient = useQueryClient();

    const options = useMemo(
        () =>
            optionsRaw
                ?.filter(({ _id }) => !filterUsers?.includes(_id))
                .map(({ first_name, last_name, email }) => ({
                    value: email,
                    label: first_name + " " + last_name,
                })) ?? [],
        [optionsRaw, filterUsers],
    );

    useEffect(() => {
        if (query?.trim().length > 0) refetch();
    }, [query]);

    const {
        field: { value, name },
        form: { touched },
    } = props;

    useEffect(() => {
        if (touched[name] && !value) {
            queryClient.resetQueries(QueryContextKey.QUERY_USER);
        }
    }, [touched[name], value]);

    return (
        <CUIAutocomplete
            items={options}
            isOpen={!!query && options.length > 0}
            {...props}
        />
    );
}

export default QueryUser;
