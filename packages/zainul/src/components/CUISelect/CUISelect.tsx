import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    theme,
    Theme,
    useColorModeValue,
    useTheme,
} from "@chakra-ui/react";
import Select, {
    defaultTheme as selectTheme,
    OptionTypeBase,
    Props as SelectComponentsProps,
} from "react-select";
import React, { ReactElement } from "react";
import { FieldProps } from "formik";
import { v4 as uuid } from "uuid";

export interface CUISelectProps extends SelectComponentsProps<OptionTypeBase, boolean> {
    name?: string;
    isSearchBar?: boolean;
}

/**
 * @deprecated
 */

const CUISelect = ({ isSearchBar = false, ...props }: CUISelectProps): ReactElement => {
    const appTheme = useTheme<typeof theme>();
    const unsafeAppColors = appTheme.colors as Theme["colors"] & {
        primary: Theme["colors"]["green"];
    };
    const accent = useColorModeValue(
        {
            primary: unsafeAppColors.primary[500],
            primary75: unsafeAppColors.primary[300],
        },
        {
            primary: unsafeAppColors.primary[300],
            primary75: unsafeAppColors.primary[200],
        },
    );

    const bg = useColorModeValue(
        {},
        {
            neutral0: unsafeAppColors.gray[800],
            neutral5: unsafeAppColors.gray[900],
            neutral10: unsafeAppColors.gray[700],
        },
    );

    const textColor = useColorModeValue(
        unsafeAppColors.gray[700],
        unsafeAppColors.gray[100],
    );

    return (
        <Select
            {...props}
            theme={{
                ...selectTheme,
                colors: {
                    ...selectTheme.colors,
                    ...bg,
                    ...accent,
                    primary50: unsafeAppColors.primary[100],
                    primary25: unsafeAppColors.primary[100],
                },
            }}
            styles={{
                input(base) {
                    return { ...base, color: textColor };
                },
                control(base) {
                    return { ...base, background: "inherit" };
                },
                option(base, props) {
                    return {
                        ...base,
                        color: props.isFocused ? unsafeAppColors.gray[700] : undefined,
                    };
                },
            }}
            components={
                isSearchBar
                    ? {
                          MultiValueContainer() {
                              return <></>;
                          },
                          IndicatorsContainer() {
                              return <></>;
                          },
                      }
                    : undefined
            }
        />
    );
};

CUISelect.defaultProps = {
    hideSelectedOptions: true,
    isSearchable: true,
};

export default CUISelect;

export interface CUISelectFieldProps extends FieldProps, CUISelectProps {
    label?: string;
}

export function CUISelectField({
    field: { value, onChange, ...field },
    form,
    ...props
}: CUISelectFieldProps) {
    const id = props.id ?? uuid();
    const name = field.name;

    return (
        <FormControl isInvalid={!!(form.errors?.[name] && form.touched?.[name])}>
            <FormLabel htmlFor={id}>{props?.label}</FormLabel>
            <CUISelect
                inputValue={value}
                onInputChange={(nValue) => {
                    onChange({ target: { value: nValue, name, id } });
                }}
                {...field}
                inputId={id}
                {...props}
            />
            <FormErrorMessage>{form.errors?.[name]}</FormErrorMessage>
        </FormControl>
    );
}
