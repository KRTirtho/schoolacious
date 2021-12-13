import {
    Badge,
    chakra,
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
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import React, { FC, useEffect, useMemo } from "react";
import { IoIosNotifications } from "react-icons/io";
import {
    NotificationsSchema,
    NOTIFICATION_STATUS,
    WS_SERVER_EVENTS,
} from "@veschool/types";
import { useSocket } from "services/ws/socket";
import { useQueryClient } from "react-query";
import useTitumirMutation from "hooks/useTitumirMutation";
import {
    NotificationUpdateProperties,
    UpdateMultipleProperties,
} from "services/titumir-client/modules/notification";

function NotificationPopover() {
    const socket = useSocket();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: notifications, refetch } = useTitumirQuery<NotificationsSchema[]>(
        QueryContextKey.NOTIFICATIONS,
        async (api) => {
            const { json } = await api.notification.list();
            return json;
        },
    );

    const { mutate: updateNotificationStatus } = useTitumirMutation<
        UpdateMultipleProperties,
        NotificationUpdateProperties
    >(
        MutationContextKey.UPDATE_NOTIFICATION_STATUS,
        async (api, data) => {
            const { json } = await api.notification.updateStatus(data);
            return json;
        },
        {
            async onSuccess() {
                await refetch();
            },
        },
    );

    const queryClient = useQueryClient();

    // adding newly created notifications on WS server events to the
    // notification-query cache
    useEffect(() => {
        socket.on(WS_SERVER_EVENTS.notification, (notification: NotificationsSchema) => {
            queryClient.setQueryData<NotificationsSchema[]>(
                QueryContextKey.NOTIFICATIONS,
                (old = []) => [...old, notification],
            );
        });
    }, []);

    // updating unread notifications as viewed when the Notification
    // Popover is open for the first for those unread notifications
    useEffect(() => {
        if (isOpen && notifications && notifications.length > 0) {
            const unreadNotificationIds = notifications
                ?.filter(
                    (notification) => notification.status === NOTIFICATION_STATUS.unread,
                )
                .map(({ _id }) => _id);
            if (unreadNotificationIds)
                updateNotificationStatus({
                    notifications: unreadNotificationIds,
                    status: NOTIFICATION_STATUS.viewed,
                });
        }
    }, [isOpen, notifications]);

    const unreadCount = useMemo(
        () =>
            notifications?.filter((n) => n.status === NOTIFICATION_STATUS.unread)
                .length ?? 0,
        [notifications],
    );

    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
                <chakra.div pos="relative">
                    {unreadCount > 0 && (
                        <Badge pos="absolute" right="5%" top="5%" colorScheme="red">
                            {unreadCount}
                        </Badge>
                    )}
                    <IconButton
                        variant="ghost"
                        aria-label="notifications button"
                        icon={<IoIosNotifications />}
                    />
                </chakra.div>
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
                                    date={new Date(created_at)}
                                    status={status}
                                />
                            ),
                        )}
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
