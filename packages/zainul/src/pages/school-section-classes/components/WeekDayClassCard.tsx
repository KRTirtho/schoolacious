import {
    useColorModeValue,
    chakra,
    Heading,
    HStack,
    Icon,
    VStack,
    Text,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { ClassSchema, TeachersToSectionsToGradesSchema } from "@veschool/types";
import Paper from "components/Paper/Paper";
import { FiClock } from "react-icons/fi";
import { GiDuration } from "react-icons/gi";
import { userToName } from "utils/userToName";
import CreateWeekDayClassPopover from "./CreateWeekDayClassPopover";
import { useRouteMatch } from "react-router-dom";
import { SchoolSectionMembersParams } from "pages/configure-grade-section/configure-grade-section";
import useTitumirQuery from "hooks/useTitumirQuery";
import { QueryContextKey } from "configs/enums";
import { useAuthStore } from "state/authorization-store";

export interface WeekDayClassCardProps {
    day: string;
    classes: ClassSchema[];
}

export const WeekDayClassCard: FC<WeekDayClassCardProps> = ({ day, classes }) => {
    const textColor = useColorModeValue("primary.500", "primary.200");

    const { params } = useRouteMatch<SchoolSectionMembersParams>();

    const short_name = useAuthStore((s) => s.user?.school?.short_name);

    const { data: sectionTeachers } = useTitumirQuery<
        TeachersToSectionsToGradesSchema[] | null
    >(QueryContextKey.SECTION_TEACHERS, async (api) => {
        if (!(short_name && params?.grade && params?.section)) return null;
        const { json } = await api.getSectionTeachers(
            short_name,
            parseInt(params.grade),
            params.section,
        );
        return json;
    });

    return (
        <Paper
            style={{ margin: 5 }}
            variant="outlined"
            border="0"
            colorScheme="tinted"
            maxW="sm"
            py="3"
            px="5"
        >
            <VStack align="flex-start" w="full">
                <Heading color={textColor} size="md">
                    {day}
                </Heading>
                <HStack w="full" wrap="wrap" justify="center">
                    {classes.map(({ _id, duration, host, time }, i) => (
                        <Paper key={_id + i} as={chakra.div} maxW="32" p="2">
                            <Heading size="sm" fontWeight="bold">
                                English
                            </Heading>
                            <Text fontWeight="semibold">{userToName(host.user)}</Text>
                            <Text color="red.400">
                                <Icon fontSize="xl">
                                    <FiClock />
                                </Icon>
                                {time}
                            </Text>
                            <Text color="blue.400">
                                <Icon fontSize="xl">
                                    <GiDuration />
                                </Icon>
                                {duration}mins
                            </Text>
                        </Paper>
                    ))}
                    <CreateWeekDayClassPopover
                        sectionTeachers={sectionTeachers}
                        day={day}
                    />
                </HStack>
            </VStack>
        </Paper>
    );
};
