import { Container, ContainerProps, useColorModeValue, theme } from "@chakra-ui/react";
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
    const borderColor = useColorModeValue(theme.colors.gray[800], theme.colors.gray[200]);

    const colorSchemesRaw = {
        container: {
            dark: { bg: theme.colors.gray[800] },
            light: { bg: theme.colors.white },
        },
        tinted: {
            dark: { bg: theme.colors.gray[600] },
            light: { bg: theme.colors.gray[200] },
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
