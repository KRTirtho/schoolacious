import {
    Heading,
    IconButton,
    List,
    ListItem,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import React, { FC } from "react";
import { IoIosNotifications } from "react-icons/io";
import { NotificationsSchema, NOTIFICATION_STATUS } from "@veschool/types";

function NotificationPopover() {
    const { data: notifications } = useTitumirQuery<NotificationsSchema[]>(
        QueryContextKey.NOTIFICATIONS,
        async (api) => {
            const { json } = await api.getNotifications();
            return json;
        },
    );

    return (
        <Popover>
            <PopoverTrigger>
                <IconButton
                    variant="ghost"
                    aria-label="notifications button"
                    icon={<IoIosNotifications />}
                />
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <Heading size="md">Notifications</Heading>
                </PopoverHeader>
                <PopoverBody p="unset">
                    <List>
                        {notifications?.map(
                            ({ _id, message, src, created_at, status }, i) => (
                                <NotificationItem
                                    key={_id + i}
                                    message={message}
                                    src={src}
                                    date={created_at}
                                    status={status}
                                />
                            ),
                        )}
                        <NotificationItem
                            date={new Date()}
                            message={"Get ready for the classes fool"}
                            src={"class"}
                            status={NOTIFICATION_STATUS.unread}
                        />
                    </List>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export default NotificationPopover;

interface NotificationItemProps {
    src: string;
    message: string;
    date: Date;
    status: NOTIFICATION_STATUS;
}

export const NotificationItem: FC<NotificationItemProps> = ({
    date,
    message,
    src,
    status,
}) => {
    const bg = useColorModeValue("primary.50", "primary.900");

    return (
        <ListItem
            m="0"
            borderBottom="1px solid"
            borderBottomColor="gray.300"
            px="3"
            py="2"
            bg={status === NOTIFICATION_STATUS.unread ? bg : ""}
        >
            <VStack align="flex-start">
                <Text fontWeight="semibold">{message}</Text>
                <Text fontSize="sm">
                    Source: {src} | {date.toUTCString()}
                </Text>
            </VStack>
        </ListItem>
    );
};
