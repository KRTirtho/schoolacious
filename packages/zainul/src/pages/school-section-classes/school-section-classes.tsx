import { HStack } from "@chakra-ui/react";
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

    const weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

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
        <HStack wrap="wrap" justify="space-evenly">
            {weekDays.map((day, i) => {
                const todaysClasses = classes?.filter((c) => c.day === i);
                return (
                    <WeekDayClassCard
                        key={uniqueId()}
                        day={day}
                        classes={todaysClasses ?? []}
                    />
                );
            })}
        </HStack>
    );
};

export default SchoolSectionClasses;
