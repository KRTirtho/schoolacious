import { chakra, Table, Tbody, Td, Th, Thead, Tr, Text, HStack } from "@chakra-ui/react";
import useTitumirQuery from "hooks/useTitumirQuery";
import React, { useMemo } from "react";
import { useAuthStore } from "state/authorization-store";
import { GradeSchema } from "@veschool/types";
import { userToName } from "utils/userToName";
import AddGradeModal from "./components/AddGradeModal";
import { QueryContextKey } from "configs/enums";
import AddSectionModal from "./components/AddSectionModal";
import GradeSubjectSelector from "./components/GradeSubjectSelector";

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
        <>
            {/* Grades Table */}
            <chakra.div overflowX="auto">
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Grade</Th>
                            <Th>Moderator</Th>
                            <Th>Examiner</Th>
                            <Th>Subjects</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {grades?.map((grade, i) => (
                            <Tr key={i}>
                                <Td>{grade.standard}</Td>
                                <Td>{userToName(grade.moderator)}</Td>
                                <Td>{userToName(grade.examiner)}</Td>
                                <Td>
                                    <HStack>
                                        <Text>
                                            {grade.grades_subjects
                                                ?.map(({ subject }) => subject?.name)
                                                .join(",")}
                                        </Text>
                                        <GradeSubjectSelector
                                            grade_subjects={grade.grades_subjects}
                                            grade={grade.standard}
                                        />
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </chakra.div>
            <AddGradeModal grades={standards} />

            {/* Section Table */}
            <chakra.div overflowX="auto">
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Section</Th>
                            <Th>Class Teacher</Th>
                            <Th>Grade</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {grades?.map((grade) => {
                            return grade.sections?.map((section, i) => (
                                <Tr key={i}>
                                    <Td>{section.name}</Td>
                                    <Td>{userToName(section.class_teacher)}</Td>
                                    <Td>{grade.standard}</Td>
                                </Tr>
                            ));
                        })}
                    </Tbody>
                </Table>
            </chakra.div>
            <AddSectionModal grades={standards} />
        </>
    );
}

export default ConfigureGradeSection;
