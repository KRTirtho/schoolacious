import React, { useMemo } from "react";
import { QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import { ClassSchema } from "@schoolacious/types";
import { chakra, Heading, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import Paper from "components/Paper/Paper";
import { userToName } from "utils/userToName";
import { MdOutlineOpenInNew } from "react-icons/md";
import { Link } from "react-router-dom";
import { globalToLocalTimeString } from "utils/local-global-time";
import { uniqWith } from "lodash-es";

export const UpcomingClasses = () => {
    const { data: upcomingClasses } = useTitumirQuery<ClassSchema[] | null>(
        QueryContextKey.UPCOMING_CLASSES,
        async (api) => {
            const { json } = await api.user.listUpcomingClasses();
            return json;
        },
    );

    const decentralizedUpcomingClasses = useMemo(() => {
        const same = upcomingClasses?.map(
            ({ host: { grade, section, user, subject }, ...rest }) => {
                const sameGradeSectionClasses = upcomingClasses
                    .filter(
                        (s) =>
                            s.host.grade._id === grade._id &&
                            s.host.section._id === section._id &&
                            s._id !== rest._id,
                    )
                    .map(({ host: { subject, user }, ..._class }) => ({
                        ..._class,
                        subject,
                        user,
                    }));
                return {
                    ...grade,
                    section: {
                        ...section,
                        class: undefined,
                        classes: [...sameGradeSectionClasses, { ...rest, user, subject }],
                    },
                };
            },
        );

        const clean = uniqWith(
            same,
            (a, b) => a._id === b._id && a.section._id === b.section._id,
        );
        return clean;
    }, [upcomingClasses]);

    return (
        <VStack mx="5" w="full">
            <HStack w="full" justify="center">
                <Heading size="md">Upcoming Classes</Heading>
            </HStack>
            {decentralizedUpcomingClasses.map(
                ({ section: { classes, name }, standard, _id }) => {
                    return (
                        <VStack key={_id} w="full">
                            <Paper
                                alignSelf="flex-start"
                                variant="outlined"
                                colorScheme="tinted"
                            >
                                <Heading textAlign="left" size="sm">
                                    <chakra.span color="blue.500">grade::</chakra.span>{" "}
                                    {standard}/{" "}
                                    <chakra.span color="blue.500">section::</chakra.span>
                                    {name}
                                </Heading>
                            </Paper>
                            {classes.map(
                                ({ time, user, subject, sessionId, _id, duration }) => {
                                    return (
                                        <Paper
                                            key={_id}
                                            variant="elevated"
                                            colorScheme="tinted"
                                            p="5"
                                        >
                                            <VStack>
                                                <HStack>
                                                    <Text>{subject.name} class </Text>
                                                    <Heading
                                                        fontSize="18"
                                                        whiteSpace="nowrap"
                                                    >
                                                        at {globalToLocalTimeString(time)}
                                                    </Heading>
                                                    <Text>
                                                        By{" "}
                                                        <chakra.span
                                                            fontWeight="semibold"
                                                            color="purple.500"
                                                        >
                                                            {userToName(user)}
                                                        </chakra.span>{" "}
                                                    </Text>
                                                    <IconButton
                                                        aria-label="Visit Class session"
                                                        as={Link}
                                                        to={`/class/${standard}/${name}/${sessionId}`}
                                                        icon={<MdOutlineOpenInNew />}
                                                        variant="ghost"
                                                    />
                                                </HStack>
                                                <Text>
                                                    Duration
                                                    <chakra.span color="blue.300">
                                                        {" "}
                                                        {duration / 60} mins
                                                    </chakra.span>
                                                </Text>
                                            </VStack>
                                        </Paper>
                                    );
                                },
                            )}
                        </VStack>
                    );
                },
            )}
        </VStack>
    );
};
