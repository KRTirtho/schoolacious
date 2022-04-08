import { Heading, HStack, VStack } from "@chakra-ui/react";
import useTitumirQuery from "hooks/useTitumirQuery";
import { SchoolSectionMembersParams } from "pages/configure-grade-section/configure-grade-section";
import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { ClassSchema } from "@schoolacious/types";
import { QueryContextKey } from "configs/enums";
import { uniqueId } from "lodash-es";
import { WeekDayClassCard } from "./WeekDayClassCard";

const SchoolSectionClasses: FC = () => {
    const params = useParams<keyof SchoolSectionMembersParams>();

    const weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const { data: classes } = useTitumirQuery<ClassSchema[] | null>(
        [QueryContextKey.CLASSES, params?.grade, params?.section],
        async (api) => {
            if (!(params.grade && params.section)) return null;

            api.setGradeId(parseInt(params.grade));
            api.setSectionId(params.section);

            const { json } = await api.class.list();

            return json;
        },
    );

    return (
        <VStack align="flex-start">
            <Heading size="md">
                Grade {params?.grade} | Section {params?.section} Class Schedule
            </Heading>
            <HStack wrap="wrap" justify="space-evenly">
                {weekDays.map((day, i) => {
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
