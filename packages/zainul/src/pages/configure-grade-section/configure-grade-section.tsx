import { Accordion, HStack, VStack } from "@chakra-ui/react";
import useTitumirQuery from "hooks/useTitumirQuery";
import React, { useMemo } from "react";
import { useAuthStore } from "state/authorization-store";
import { GradeSchema } from "@veschool/types";
import AddGradeModal from "./components/AddGradeModal";
import { QueryContextKey } from "configs/enums";
import AddSectionModal from "./components/AddSectionModal";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import SchoolSectionMembers from "pages/school-section-members/school-section-members";
import NotFound404 from "routing/404";
import SchoolSectionClasses from "pages/school-section-classes/school-section-classes";
import GradeAccordion from "./components/GradeAccordion";

function ConfigureGradeSection() {
    const school = useAuthStore((s) => s.user?.school);
    const { data: grades } = useTitumirQuery<GradeSchema[] | null>(
        QueryContextKey.GRADES,
        async (api) => {
            if (!school) return null;
            const { json } = await api.getGrades(school.short_name, {
                extended:
                    "sections,moderator,sections.class_teacher,examiner,grades_subjects,grades_subjects.subject",
            });
            return json;
        },
    );

    const standards = useMemo(() => grades?.map(({ standard }) => standard), [grades]);

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <Accordion allowMultiple allowToggle>
                    <VStack spacing="1" align="center">
                        {grades?.map((grade) => (
                            <GradeAccordion grade={grade} key={grade._id} />
                        ))}
                    </VStack>
                </Accordion>
                <HStack justify="space-evenly">
                    <AddGradeModal grades={standards} />
                    <AddSectionModal grades={standards} />
                </HStack>
            </Route>
            <Route path={`${path}/:grade/:section/members`}>
                <SchoolSectionMembers />
            </Route>
            <Route path={`${path}/:grade/:section/classes`}>
                <SchoolSectionClasses />
            </Route>
            <Route path="*">
                <NotFound404 />
            </Route>
        </Switch>
    );
}

export default ConfigureGradeSection;

export interface SchoolSectionMembersParams {
    grade: string;
    section: string;
}
