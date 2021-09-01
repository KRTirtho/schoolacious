import { ListItemProps, useColorModeValue, ListItem } from "@chakra-ui/react";
import React, { FC } from "react";
import { LinkProps, useLocation, Link } from "react-router-dom";

export const SidebarItem: FC<ListItemProps & LinkProps> = (props) => {
    const location = useLocation();
    const bg = useColorModeValue("gray.50", "gray.700");
    const borderBottomColor = useColorModeValue("gray.300", "gray.600");

    const isActive = props.to === location.pathname;
    return (
        <ListItem
            bg={bg}
            as={Link}
            p="3"
            borderRight={isActive ? "solid 5px" : ""}
            borderColor={isActive ? "green.500" : ""}
            filter={isActive ? "brightness(90%)" : ""}
            _hover={{
                filter: "brightness(90%)",
            }}
            _active={{
                filter: "brightness(95%)",
            }}
            _first={{
                borderTopLeftRadius: "md",
            }}
            _last={{
                borderBottomLeftRadius: "md",
            }}
            _notLast={{
                borderBottom: "1px solid",
                borderBottomColor,
            }}
            fontWeight="bold"
            {...props}
        />
    );
};
