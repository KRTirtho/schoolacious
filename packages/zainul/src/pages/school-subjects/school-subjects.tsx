import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import React from "react";
import { useAuthStore } from "state/authorization-store";
import { SubjectSchema } from "@veschool/types";
import AddSubjectsModal from "./components/AddSubjectsModal";

function SchoolSubjects() {
    const short_name = useAuthStore((s) => s.user?.school?.short_name);

    const { data: subjects } = useTitumirQuery<SubjectSchema[] | null>(
        QueryContextKey.SCHOOL_SUBJECTS,
        async (api) => {
            if (!short_name) return null;
            const { json } = await api.getSchoolSubjects(short_name);
            return json;
        },
    );

    return (
        <>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Subject Name</Th>
                        <Th>Used by</Th>
                        <Th>Description</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {subjects?.map(({ _id, name, description }, i) => (
                        <Tr key={_id + i}>
                            <Td>{name}</Td>
                            <Td>1-A, 2-A</Td>
                            <Td>{description}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <AddSubjectsModal />
        </>
    );
}

export default SchoolSubjects;
