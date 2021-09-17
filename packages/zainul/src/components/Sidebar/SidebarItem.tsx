import { ListItemProps, useColorModeValue, ListItem } from "@chakra-ui/react";
import React, { FC } from "react";
import { LinkProps, useLocation, Link } from "react-router-dom";

export type SidebarItemProps = ListItemProps &
    LinkProps & {
        /**
         * matches path exactly with location.path else matches with
         * startWith
         * @default true
         */
        exact?: boolean;
    };

export const SidebarItem: FC<SidebarItemProps> = ({ exact = true, ...props }) => {
    const location = useLocation();
    const bg = useColorModeValue("gray.50", "gray.700");
    const borderBottomColor = useColorModeValue("gray.300", "gray.600");

    const isActive = !exact
        ? location.pathname.startsWith(props.to.toString())
        : location.pathname === props.to;
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
