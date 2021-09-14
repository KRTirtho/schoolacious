import {
    chakra,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    HStack,
    IconButton,
} from "@chakra-ui/react";
import useTitumirQuery from "hooks/useTitumirQuery";
import React, { useMemo } from "react";
import { useAuthStore } from "state/authorization-store";
import { GradeSchema } from "@veschool/types";
import { userToName } from "utils/userToName";
import AddGradeModal from "./components/AddGradeModal";
import { QueryContextKey } from "configs/enums";
import AddSectionModal from "./components/AddSectionModal";
import GradeSubjectSelector from "./components/GradeSubjectSelector";
import { FaUsersCog } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import SchoolSectionMembers from "pages/school-section-members/school-section-members";
import NotFound404 from "routing/404";
import SchoolSectionClasses from "pages/school-section-classes/school-section-classes";

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
                                <Th>Members | Classes</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {grades?.map((grade) => {
                                return grade.sections?.map((section, i) => (
                                    <Tr key={i}>
                                        <Td>{section.name}</Td>
                                        <Td>{userToName(section.class_teacher)}</Td>
                                        <Td>{grade.standard}</Td>
                                        <Td>
                                            <HStack spacing="2">
                                                <IconButton
                                                    as={Link}
                                                    colorScheme="gray"
                                                    aria-label="Configure section members"
                                                    icon={<FaUsersCog />}
                                                    variant="ghost"
                                                    to={`${path}/${grade.standard}/${section.name}/members`}
                                                />
                                                <IconButton
                                                    as={Link}
                                                    colorScheme="gray"
                                                    aria-label="Configure section classes"
                                                    icon={<SiGoogleclassroom />}
                                                    variant="ghost"
                                                    to={`${path}/${grade.standard}/${section.name}/classes`}
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ));
                            })}
                        </Tbody>
                    </Table>
                </chakra.div>
                <AddSectionModal grades={standards} />
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
