import {
    ListItem,
    HStack,
    Avatar,
    Text,
    ListItemProps,
    StackProps,
    AvatarProps,
    forwardRef,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

export interface ListAvatarTileProps
    extends ListItemProps,
        Pick<StackProps, "spacing" | "direction">,
        Pick<AvatarProps, "size"> {
    src?: string;
    to?: string;
    name: string;
    leading?: ReactElement;
    ending?: ReactElement;
}

const ListAvatarTile = forwardRef<ListAvatarTileProps, "div">(function ListAvatarTile(
    {
        src,
        name,
        spacing = 2,
        direction = "row",
        leading,
        ending,
        children,

        to,
        ...props
    },
    ref,
) {
    const avatar = <Avatar name={name} size="sm" src={src} />;
    return (
        <ListItem p="2" {...props} ref={ref}>
            <HStack
                spacing={spacing}
                direction={direction}
                justify={props.justifyContent ?? "space-between"}
                align={props.alignItems}
            >
                <HStack>
                    {leading}
                    {to ? <Link to={to ?? "/null"}>{avatar}</Link> : avatar}
                    <Text
                        as={to ? Link : undefined}
                        to={to ?? "/null"}
                        _hover={{ textDecoration: to ? "underline" : "none" }}
                    >
                        {name}
                    </Text>
                    {children}
                </HStack>
                {ending}
            </HStack>
        </ListItem>
    );
});

export default ListAvatarTile;
