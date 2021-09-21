import { useColorModeValue, chakra, Heading, Icon, VStack, Text } from "@chakra-ui/react";
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
import { MutationContextKey, QueryContextKey } from "configs/enums";
import { useAuthStore } from "state/authorization-store";
import useTitumirMutation from "hooks/useTitumirMutation";
import { ScheduleClassBody } from "services/api/titumir";
import { secondsToMinutes, minutesToSeconds } from "date-fns";
import { militaryTo12HourTime } from "utils/militaryTo12HourTime";
import { useQueryClient } from "react-query";

export interface WeekDayClassCardProps {
    day: [string, string];
    classes: ClassSchema[];
}

export const WeekDayClassCard: FC<WeekDayClassCardProps> = ({
    day: [dayIndex, day],
    classes,
}) => {
    const textColor = useColorModeValue("primary.500", "primary.200");

    const { params } = useRouteMatch<SchoolSectionMembersParams>();

    const short_name = useAuthStore((s) => s.user?.school?.short_name);

    const isQueryable = params?.grade && params?.section;

    const { data: sectionTeachers } = useTitumirQuery<
        TeachersToSectionsToGradesSchema[] | null
    >([QueryContextKey.SECTION_TEACHERS, params?.grade, params?.section], async (api) => {
        if (!(short_name && isQueryable)) return null;
        const { json } = await api.getSectionTeachers(
            short_name,
            parseInt(params.grade),
            params.section,
        );
        return json;
    });

    const queryClient = useQueryClient();

    const { mutate: scheduleClass } = useTitumirMutation<
        ClassSchema | null,
        ScheduleClassBody
    >(
        [MutationContextKey.CREATE_CLASS, day, params?.grade, params?.section],
        async (api, data) => {
            if (!(short_name && isQueryable)) return null;
            const { json } = await api.createClass(
                short_name,
                parseInt(params.grade),
                params.section,
                data,
            );
            return json;
        },
        {
            onSuccess() {
                queryClient.refetchQueries([
                    QueryContextKey.CLASSES,
                    params?.grade,
                    params?.section,
                ]);
            },
        },
    );

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
                <chakra.div
                    display="flex"
                    w="full"
                    flexWrap="wrap"
                    justifyContent="center"
                >
                    {classes.map(({ _id, duration, host, time }, i) => (
                        <Paper key={_id + i} as={chakra.div} maxW="32" p="2" m="1">
                            <Heading size="sm" fontWeight="bold">
                                {host?.subject?.name}
                            </Heading>
                            <Text fontWeight="semibold">{userToName(host.user)}</Text>
                            <Text color="red.400">
                                <Icon fontSize="xl">
                                    <FiClock />
                                </Icon>
                                {militaryTo12HourTime(time)}
                            </Text>
                            <Text color="blue.400">
                                <Icon fontSize="xl">
                                    <GiDuration />
                                </Icon>
                                {secondsToMinutes(duration)} mins
                            </Text>
                        </Paper>
                    ))}
                    <CreateWeekDayClassPopover
                        sectionTeachers={sectionTeachers}
                        day={day}
                        onSubmit={(
                            { host, time, duration },
                            { setSubmitting, resetForm },
                        ) => {
                            scheduleClass(
                                {
                                    day: parseInt(dayIndex),
                                    host,
                                    time: `${time}:00`,
                                    duration: minutesToSeconds(parseInt(duration)),
                                },
                                {
                                    onSuccess() {
                                        setSubmitting(false);
                                        resetForm();
                                    },
                                    onError() {
                                        setSubmitting(false);
                                    },
                                },
                            );
                        }}
                    />
                </chakra.div>
            </VStack>
        </Paper>
    );
};
