import { QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import React from "react";
import { ClassSchema } from "@veschool/types";
import { useAuthStore } from "state/authorization-store";
import { chakra, Heading, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import Paper from "components/Paper/Paper";
import { userToName } from "utils/userToName";
import { MdOutlineOpenInNew } from "react-icons/md";
import { Link } from "react-router-dom";

export const UpcomingClasses = () => {
    const ssg = useAuthStore((s) => s.user?.ssg);
    const { data: upcomingClasses } = useTitumirQuery<ClassSchema[] | null>(
        QueryContextKey.UPCOMING_CLASSES,
        async (api) => {
            if (!ssg?.grade || !ssg?.section) return null;
            api.setGradeId(ssg.grade.standard);
            api.setSectionId(ssg.section.name);
            const { json } = await api.class.listUpcoming();
            return json;
        },
    );

    return (
        <VStack mx="5" w="full">
            <HStack w="full" justify="center">
                <Heading size="md">Upcoming Classes</Heading>
            </HStack>
            {upcomingClasses?.map((upcoming) => {
                return (
                    <Paper
                        key={upcoming._id}
                        variant="elevated"
                        colorScheme="tinted"
                        p="5"
                    >
                        <VStack>
                            <HStack>
                                <Heading fontSize="18">At {upcoming.time}</Heading>
                                <Text>
                                    By{" "}
                                    <chakra.span fontWeight="semibold" color="purple.500">
                                        {userToName(upcoming.host.user)}
                                    </chakra.span>{" "}
                                </Text>
                                <IconButton
                                    aria-label="Visit Class session"
                                    as={Link}
                                    to={`/class/${upcoming.host.grade.standard}/${upcoming.host.section.name}/${upcoming.sessionId}`}
                                    icon={<MdOutlineOpenInNew />}
                                    variant="ghost"
                                />
                            </HStack>
                            <Text>
                                Duration
                                <chakra.span color="blue.300">
                                    {" "}
                                    {upcoming.duration / 60} mins
                                </chakra.span>
                            </Text>
                        </VStack>
                    </Paper>
                );
            })}
        </VStack>
    );
};
