import { Heading, HStack, VStack } from "@chakra-ui/react";
import useTitumirQuery from "hooks/useTitumirQuery";
import { SchoolSectionMembersParams } from "pages/configure-grade-section/configure-grade-section";
import React, { FC } from "react";
import { useRouteMatch } from "react-router-dom";
import { ClassSchema } from "@veschool/types";
import { QueryContextKey } from "configs/enums";
import { useAuthStore } from "state/authorization-store";
import { uniqueId } from "lodash-es";
import { WeekDayClassCard } from "./components/WeekDayClassCard";

const SchoolSectionClasses: FC = () => {
    const { params } = useRouteMatch<SchoolSectionMembersParams>();

    const weekDays = Object.freeze({
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    });

    const short_name = useAuthStore((s) => s.user?.school?.short_name);

    const isQueryable = params?.grade && params?.section;

    const { data: classes } = useTitumirQuery<ClassSchema[] | null>(
        [QueryContextKey.CLASSES, params?.grade, params?.section],
        async (api) => {
            if (!(short_name && isQueryable)) return null;

            const { json } = await api.getClasses(
                short_name,
                parseInt(params.grade),
                params.section,
            );

            return json;
        },
    );

    return (
        <VStack align="flex-start">
            <Heading size="md">
                Grade {params?.grade} | Section {params?.section} Class Schedule
            </Heading>
            <HStack wrap="wrap" justify="space-evenly">
                {Object.entries(weekDays).map((day, i) => {
                    const todaysClasses = classes
                        ?.filter((c) => c.day === i)
                        .sort((a, b) => a.time.localeCompare(b.time));
                    return (
                        <WeekDayClassCard
                            key={uniqueId()}
                            day={day}
                            classes={todaysClasses ?? []}
                        />
                    );
                })}
            </HStack>
        </VStack>
    );
};

export default SchoolSectionClasses;