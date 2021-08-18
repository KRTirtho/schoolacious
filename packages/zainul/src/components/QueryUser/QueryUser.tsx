import React, { useEffect } from "react";
import { OptionsType } from "react-select";
import { UserSchema } from "@veschool/types";
import { QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import { OptionType } from "pages/add-remove-members/components/InviteMembersDrawer";
import { CUISelectField, CUISelectFieldProps } from "../CUISelect/CUISelect";

export type QueryUserProps = CUISelectFieldProps;

function QueryUser(props: QueryUserProps) {
    const query = props.field.value;

    const {
        data: optionsRaw,
        refetch,
        isLoading,
    } = useTitumirQuery<UserSchema[]>(
        QueryContextKey.QUERY_USER,
        (api) => api.queryUser(query).then(({ json }) => json),
        {
            enabled: false,
        },
    );

    const options: OptionsType<OptionType> =
        optionsRaw?.map(({ first_name, last_name, _id }) => ({
            value: _id,
            label: first_name + " " + last_name,
        })) ?? [];

    useEffect(() => {
        if (query.trim().length > 0) refetch();
    }, [query]);

    return (
        <CUISelectField
            closeMenuOnSelect={false}
            isSearchBar
            isLoading={isLoading}
            options={options}
            inputValue={query}
            {...props}
        />
    );
}

export default QueryUser;
