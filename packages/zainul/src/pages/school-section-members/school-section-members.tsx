import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import React, { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";
import { useAuthStore } from "state/authorization-store";
import {
    chakra,
    Divider,
    Heading,
    HStack,
    List,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
} from "@chakra-ui/react";
import { userToName } from "utils/userToName";
import {
    AddSectionStudentsBody,
    AddSectionStudentsReturns,
    AssignSectionTeacherBody,
    SectionWithSubject,
} from "services/api/titumir";
import ListAvatarTile from "components/ListAvatarTile/ListAvatarTile";
import { AddUserPopover } from "components/AddUserPopover/AddUserPopover";
import useTitumirMutation from "hooks/useTitumirMutation";
import { TeachersToSectionsToGradesSchema, USER_ROLE } from "@veschool/types";
import AddMultipleUserSlide from "components/AddMultipleUserSlide/AddMultipleUserSlide";

interface SchoolSectionMembersParams {
    grade: string;
    section: string;
}

function SchoolSectionMembers() {
    const { params } = useRouteMatch<SchoolSectionMembersParams>();

    const school = useAuthStore((s) => s.user?.school);

    const short_name = school?.short_name;

    const { data: section, refetch } = useTitumirQuery<SectionWithSubject | null>(
        [QueryContextKey.SECTION, params?.grade, params?.section],
        async (api) => {
            if (!(short_name && params?.grade && params?.section)) return null;
            const { json } = await api.getSection(
                short_name,
                parseInt(params.grade),
                params.section,
            );

            return json;
        },
    );

    const class_teacher = useMemo(
        () => userToName(section?.class_teacher),
        [section?.class_teacher],
    );

    const mutationsOpt = {
        onSuccess() {
            refetch();
        },
    };

    const { mutate: assignSectionTeacher } = useTitumirMutation<
        TeachersToSectionsToGradesSchema | null,
        AssignSectionTeacherBody
    >(
        [MutationContextKey.ADD_SECTION_TEACHER, params?.grade, params?.section],
        async (api, data) => {
            if (!(short_name && params?.grade && params?.section)) return null;
            const { json } = await api.assignSectionTeacher(
                short_name,
                parseInt(params.grade),
                params.section,
                data,
            );

            return json;
        },
        mutationsOpt,
    );

    const { mutate: addSectionStudents } = useTitumirMutation<
        AddSectionStudentsReturns | null,
        AddSectionStudentsBody[]
    >(
        [MutationContextKey.ADD_SECTION_STUDENTS, params?.grade, params?.section],
        async (api, data) => {
            if (!(short_name && params?.grade && params?.section)) return null;
            const { json } = await api.addSectionStudents(
                short_name,
                parseInt(params.grade),
                params.section,
                data,
            );

            return json;
        },
        mutationsOpt,
    );

    return (
        <VStack align="flex-start">
            <HStack overflowY="hidden" justify="space-between" w="full" pr="3">
                <Heading size="md">
                    Grade {params?.grade} | Section {params.section}
                </Heading>
                {section?.class_teacher && <Text fontWeight="bold">{class_teacher}</Text>}
            </HStack>

            <Divider />

            {/* teachers with their subject that they teach */}
            <chakra.div overflow="auto" w="full">
                <Heading size="md">#Teachers</Heading>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Subject</Th>
                            <Th>Teacher</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {section?.subjects?.map(({ subject, teacher }, i) => (
                            <Tr key={subject._id + i}>
                                <Td>
                                    <Text fontWeight="bold">{subject.name}</Text>
                                </Td>
                                <Td>
                                    <HStack>
                                        <Text color={!teacher ? "red.400" : undefined}>
                                            {userToName(teacher)}
                                        </Text>
                                        <AddUserPopover
                                            name="teacher"
                                            onSubmit={(
                                                values,
                                                { setSubmitting, resetForm },
                                                onClose,
                                            ) => {
                                                assignSectionTeacher(
                                                    {
                                                        email: values.teacher as string,
                                                        subject_id: subject._id,
                                                    },
                                                    {
                                                        onSuccess() {
                                                            setSubmitting(false);
                                                            resetForm();
                                                            onClose();
                                                        },
                                                        onError() {
                                                            setSubmitting(false);
                                                        },
                                                    },
                                                );
                                            }}
                                            placeholder="Search teacher..."
                                            heading={`Teacher for ${subject.name}`}
                                        />
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </chakra.div>

            {/* Students */}
            <chakra.div w="full">
                <Heading size="md">#Students</Heading>
                <List>
                    {section?.studentsToSectionsToGrade?.map(({ _id, user }, i) => (
                        <ListAvatarTile key={_id + i} name={userToName(user)} />
                    ))}
                </List>
                <AddMultipleUserSlide
                    onSubmit={(selections, onClose) => {
                        addSectionStudents(
                            selections.map(({ value }) => ({ _id: value })),
                            { onSuccess: onClose },
                        );
                    }}
                    triggerTitle="Add Students"
                    heading="Add Students"
                    placeholder="Search Students..."
                    query-filters={{ role: USER_ROLE.student, school_id: school?._id }}
                />
            </chakra.div>
        </VStack>
    );
}

export default SchoolSectionMembers;
