import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
    chakra,
    Divider,
    Heading,
    HStack,
    List,
    Spinner,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
} from "@chakra-ui/react";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import { useAuthStore } from "state/authorization-store";
import { userToName } from "utils/userToName";
import type {
    SectionAddStudentsProperties,
    SectionStudentsResponseProperties,
    SectionAddTeacherProperties,
    SectionSchemaWithSubject,
} from "services/titumir-client/modules/section";
import ListAvatarTile from "components/ListAvatarTile/ListAvatarTile";
import { AddUserPopover } from "components/AddUserPopover/AddUserPopover";
import useTitumirMutation from "hooks/useTitumirMutation";
import { TeachersToSectionsToGradesSchema, USER_ROLE } from "@schoolacious/types";
import AddMultipleUserSlide from "components/AddMultipleUserSlide/AddMultipleUserSlide";
import { SchoolSectionMembersParams } from "pages/configure-grade-section/configure-grade-section";
import GradeSubjectSelector from "pages/configure-grade-section/components/GradeSubjectSelector";

function SchoolSectionMembers() {
    // gives out the grade/section
    const params = useParams<keyof SchoolSectionMembersParams>();

    const school = useAuthStore((s) => s.user?.school);

    // fetching sections from server
    const { data: section, refetch } = useTitumirQuery<SectionSchemaWithSubject | null>(
        // using array of keys for uniqueness of each section as
        // section.name are non-unique
        [QueryContextKey.SECTION, params?.grade, params?.section],
        async (api) => {
            if (!params?.grade || !params?.section || !school) return null;
            api.setSchoolId(school.short_name);
            api.setGradeId(parseInt(params.grade));
            const { json } = await api.section.get(params.section);

            return json;
        },
    );

    const {
        data: grade,
        isLoading: isLoadingGrade,
        isError: isErrorGrade,
    } = useTitumirQuery([QueryContextKey.GRADE, params?.grade], async (api) => {
        if (!params?.grade || !school) return null;
        api.setSchoolId(school.short_name);
        api.setGradeId(parseInt(params?.grade));
        const { json } = await api.grade.get();

        return json;
    });

    //  class_teacher's name (joined)
    const class_teacher = useMemo(
        () => userToName(section?.class_teacher),
        [section?.class_teacher],
    );

    // runs after each mutation
    const mutationsOpt = {
        onSuccess() {
            refetch();
        },
    };

    // creating section teacher for each section subject
    const { mutate: addSectionTeacher } = useTitumirMutation<
        TeachersToSectionsToGradesSchema | null,
        SectionAddTeacherProperties
    >(
        [MutationContextKey.ADD_SECTION_TEACHER, params?.grade, params?.section],
        async (api, data) => {
            if (!(params?.grade && params?.section)) return null;
            api.setGradeId(parseInt(params.grade));
            const { json } = await api.section.addTeacher(data, params.section);

            return json;
        },
        mutationsOpt,
    );

    //  section students assigning caller
    const { mutate: addSectionStudents } = useTitumirMutation<
        SectionStudentsResponseProperties | null,
        SectionAddStudentsProperties[]
    >(
        [MutationContextKey.ADD_SECTION_STUDENTS, params?.grade, params?.section],
        async (api, data) => {
            if (!(params?.grade && params?.section)) return null;
            api.setGradeId(parseInt(params.grade));
            const { json } = await api.section.addStudents(data, params.section);

            return json;
        },
        mutationsOpt,
    );

    const studentIds = useMemo(
        () => section?.studentsToSectionsToGrade?.map(({ user: { _id } }) => _id),
        [section?.studentsToSectionsToGrade],
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
                                                addSectionTeacher(
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
                                            roles={[
                                                USER_ROLE.teacher,
                                                USER_ROLE.classTeacher,
                                            ]}
                                        />
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                {!isLoadingGrade && !isErrorGrade && grade ? (
                    <GradeSubjectSelector
                        useTextButton
                        grade_subjects={grade.grades_subjects}
                        grade={grade.standard}
                    />
                ) : (
                    <Spinner />
                )}
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
                    query-filters={{ roles: [USER_ROLE.student], school_id: school?._id }}
                    filter-users={(user) => !studentIds?.includes(user._id) ?? true}
                />
            </chakra.div>
        </VStack>
    );
}

export default SchoolSectionMembers;
