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

export interface ListAvatarTileProps
    extends ListItemProps,
        Pick<StackProps, "spacing" | "direction">,
        Pick<AvatarProps, "size"> {
    src?: string;
    name:
        | {
              firstName: string;
              lastName: string;
          }
        | [string, string]
        | string;
    leading?: ReactElement;
    ending?: ReactElement;
}

const ListAvatarTile = forwardRef<ListAvatarTileProps, "div">(function ListAvatarTile(
    { src, name, spacing = 2, direction = "row", leading, ending, ...props },
    ref,
) {
    const username =
        typeof name !== "string" && name ? Object.values(name).join(" ") : name;
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
                    <Avatar name={username} size="sm" src={src} />
                    <Text>{username}</Text>
                </HStack>
                {ending}
            </HStack>
        </ListItem>
    );
});

export default ListAvatarTile;
