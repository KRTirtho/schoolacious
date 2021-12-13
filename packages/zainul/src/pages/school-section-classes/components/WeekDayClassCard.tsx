import { useColorModeValue, chakra, Heading, Icon, VStack, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { ClassSchema, TeachersToSectionsToGradesSchema } from "@veschool/types";
import Paper from "components/Paper/Paper";
import { FiClock } from "react-icons/fi";
import { GiDuration } from "react-icons/gi";
import { userToName } from "utils/userToName";
import { globalToLocalTimeString } from "utils/local-global-time";
import CreateWeekDayClassPopover from "./CreateWeekDayClassPopover";
import { useParams } from "react-router-dom";
import { SchoolSectionMembersParams } from "pages/configure-grade-section/configure-grade-section";
import useTitumirQuery from "hooks/useTitumirQuery";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import { useAuthStore } from "state/authorization-store";
import useTitumirMutation from "hooks/useTitumirMutation";
import { ClassProperties } from "services/titumir-client/modules/class";
import { secondsToMinutes, minutesToSeconds, parse } from "date-fns";
import { useQueryClient } from "react-query";

export interface WeekDayClassCardProps {
    day: string;
    classes: ClassSchema[];
}

export const WeekDayClassCard: FC<WeekDayClassCardProps> = ({ day, classes }) => {
    const textColor = useColorModeValue("primary.500", "primary.200");

    const params = useParams<keyof SchoolSectionMembersParams>();

    const short_name = useAuthStore((s) => s.user?.school?.short_name);

    const { data: sectionTeachers } = useTitumirQuery<
        TeachersToSectionsToGradesSchema[] | null
    >([QueryContextKey.SECTION_TEACHERS, params?.grade, params?.section], async (api) => {
        if (!(short_name && params?.grade && params?.section)) return null;

        api.setGradeId(parseInt(params.grade));
        const { json } = await api.section.listTeacher(params.section);
        return json;
    });

    const queryClient = useQueryClient();

    const { mutate: scheduleClass } = useTitumirMutation<
        ClassSchema | null,
        ClassProperties
    >(
        [MutationContextKey.CREATE_CLASS, day, params?.grade, params?.section],
        async (api, data) => {
            if (!(short_name && params?.grade && params?.section)) return null;

            api.setGradeId(parseInt(params.grade));
            api.setSectionId(params.section);
            const { json } = await api.class.create(data);
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
                                {globalToLocalTimeString(time)}
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
                            const date = parse(
                                `${day} ${time}`,
                                "EEEE HH:mm",
                                new Date(),
                            );
                            scheduleClass(
                                {
                                    host,
                                    date,
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
