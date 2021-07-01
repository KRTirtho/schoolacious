import { theme, Theme, useColorModeValue, useTheme } from "@chakra-ui/react";
import Select, {
    defaultTheme as selectTheme,
    OptionTypeBase,
    Props as SelectComponentsProps,
} from "react-select";
import React, { ReactElement } from "react";

interface CUISelectProps extends SelectComponentsProps<OptionTypeBase, boolean> {
    name?: string;
    isSearchBar?: boolean;
}

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
            neutral0: unsafeAppColors.gray[600],
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
