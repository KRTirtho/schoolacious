import { chakra, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import useTitumirQuery from "../../hooks/useTitumirQuery";
import React, { useMemo } from "react";
import { useAuthStore } from "../../state/authorization-store";
import { GradeSchema } from "@veschool/types";
import { userToName } from "../../utils/userToName";
import AddGradeModal from "./components/AddGradeModal";
import { QueryContextKey } from "configs/enums";
import AddSectionModal from "./components/AddSectionModal";

function ConfigureSchool() {
    const school = useAuthStore((s) => s.user?.school);
    const { data: grades } = useTitumirQuery<GradeSchema[]>(
        QueryContextKey.GRADES,
        (api) =>
            api
                .getGrades(school!.short_name, {
                    extended:
                        "sections,moderator,sections.class_teacher,examiner,grades_subjects",
                })
                .then(({ json }) => json),
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
                                    {grade.grades_subjects
                                        ?.map((subject) => subject.subject.name)
                                        .join(",")}
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

export default ConfigureSchool;
