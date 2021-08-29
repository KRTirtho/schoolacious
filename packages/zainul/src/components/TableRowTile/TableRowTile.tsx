import { Tr, Td, HStack, Avatar, IconButton, Text } from "@chakra-ui/react";
import React, { FC, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface TableRowTileProps {
    heading: string;
    middle: string;
    date: Date;
    "action-variant"?: "accept-decline" | "cancel";
    "button-labels": [string, string] | string;
    onFirstButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
    onSecondButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
    leadImg?: string;
}

const TableRowTile: FC<TableRowTileProps> = ({
    heading,
    middle,
    date,
    "action-variant": actionVariant = "cancel",
    "button-labels": buttonLabels,
    onFirstButtonClick,
    onSecondButtonClick,
    leadImg,
}) => {
    useEffect(() => {
        if (actionVariant === "accept-decline" && typeof buttonLabels === "string")
            throw new TypeError(
                "Pass tuple of button-labels when using `accept-decline` action-variant",
            );
        else if (actionVariant === "cancel" && Array.isArray(buttonLabels))
            throw new TypeError(
                "Pass string for button-labels when using `cancel` action-variant",
            );
    }, [buttonLabels, actionVariant]);

    return (
        <Tr>
            <Td>
                <HStack>
                    <Avatar name={heading} src={leadImg} size="sm" />
                    <Text>{heading}</Text>
                </HStack>
            </Td>
            <Td fontWeight="bold">{middle}</Td>
            <Td>{new Date(date).toUTCString().replace(" GMT", "")}</Td>
            <Td>
                <IconButton
                    aria-label={
                        typeof buttonLabels === "string" &&
                        actionVariant === "accept-decline"
                            ? buttonLabels
                            : buttonLabels[0]
                    }
                    variant="ghost"
                    colorScheme="red"
                    onClick={onFirstButtonClick}
                >
                    <FaTimesCircle />
                </IconButton>
            </Td>
            {actionVariant === "accept-decline" && (
                <Td>
                    <IconButton
                        aria-label={buttonLabels[1]}
                        variant="ghost"
                        colorScheme="green"
                        onClick={onSecondButtonClick}
                    >
                        <FaCheckCircle />
                    </IconButton>
                </Td>
            )}
        </Tr>
    );
};

export default TableRowTile;
