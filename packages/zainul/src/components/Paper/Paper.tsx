import {
    Container,
    ContainerProps,
    useColorModeValue,
    theme as base,
    useTheme,
} from "@chakra-ui/react";
import React, { PropsWithChildren, ReactElement } from "react";

export interface PaperProps extends ContainerProps {
    variant?: "elevated" | "outlined";
    colorScheme?: "container" | "tinted";
}

function Paper({
    shadow,
    variant = "elevated",
    colorScheme = "container",
    rounded = "md",
    ...props
}: PropsWithChildren<PaperProps>): ReactElement {
    const theme = useTheme<typeof base>();

    const borderColor = useColorModeValue(theme.colors.gray[400], theme.colors.gray[200]);

    const colorSchemesRaw = {
        container: {
            dark: { bg: theme.colors.gray[800] },
            light: { bg: theme.colors.white },
        },
        tinted: {
            dark: { bg: theme.colors.gray[600] },
            light: { bg: theme.colors.gray[50] },
        },
    };

    const colorSchemes = useColorModeValue(
        colorSchemesRaw[colorScheme].light,
        colorSchemesRaw[colorScheme].dark,
    );

    const variants = {
        elevated: { shadow: shadow ?? "md" },
        outlined: { border: `1px solid ${borderColor}` },
    };

    return (
        <Container
            {...variants[variant]}
            {...colorSchemes}
            rounded={rounded}
            {...props}
        ></Container>
    );
}

export default Paper;
