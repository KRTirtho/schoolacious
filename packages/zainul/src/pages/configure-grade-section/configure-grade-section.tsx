import { Accordion, HStack, VStack } from "@chakra-ui/react";
import useTitumirQuery from "hooks/useTitumirQuery";
import React, { useMemo } from "react";
import { useAuthStore } from "state/authorization-store";
import { GradeSchema } from "@veschool/types";
import AddGradeModal from "./components/AddGradeModal";
import { QueryContextKey } from "configs/enums";
import AddSectionModal from "./components/AddSectionModal";
import { Route, Routes } from "react-router-dom";
import SchoolSectionMembers from "pages/school-section-members/school-section-members";
import SchoolSectionClasses from "pages/school-section-classes/school-section-classes";
import GradeAccordion from "./components/GradeAccordion";
import NotFound404 from "routing/404";

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

    return (
        <Routes>
            <Route
                path=""
                element={
                    <>
                        <HStack justify="space-evenly">
                            <AddGradeModal grades={standards} />
                            <AddSectionModal grades={standards} />
                        </HStack>
                        <Accordion allowMultiple allowToggle>
                            <VStack spacing="1" align="center">
                                {grades?.map((grade) => (
                                    <GradeAccordion grade={grade} key={grade._id} />
                                ))}
                            </VStack>
                        </Accordion>
                    </>
                }
            />
            <Route path=":grade/:section/members" element={<SchoolSectionMembers />} />
            <Route path=":grade/:section/classes" element={<SchoolSectionClasses />} />
            <Route path="*" element={<NotFound404 />} />
        </Routes>
    );
}

export default ConfigureGradeSection;

export interface SchoolSectionMembersParams {
    grade: string;
    section: string;
}
