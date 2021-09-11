import { QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import React, { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";
import { useAuthStore } from "state/authorization-store";
import {
    Button,
    chakra,
    Divider,
    Heading,
    HStack,
    IconButton,
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
import { SectionWithSubject } from "services/api/titumir";
import { FiEdit3 } from "react-icons/fi";
import ListAvatarTile from "components/ListAvatarTile/ListAvatarTile";

interface SchoolSectionMembersParams {
    grade: string;
    section: string;
}

function SchoolSectionMembers() {
    const { params } = useRouteMatch<SchoolSectionMembersParams>();

    const short_name = useAuthStore((s) => s.user?.school?.short_name);

    const { data: section } = useTitumirQuery<SectionWithSubject | null>(
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
                                        <IconButton
                                            aria-label="Modify Subject Teacher"
                                            size="sm"
                                            colorScheme="gray"
                                            icon={<FiEdit3 />}
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
                <Button isFullWidth variant="ghost">
                    Add Students
                </Button>
            </chakra.div>
        </VStack>
    );
}

export default SchoolSectionMembers;
