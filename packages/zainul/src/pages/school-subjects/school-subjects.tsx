import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import AddSubjectsModal from "./components/AddSubjectsModal";
import { useGetSchoolSubjects } from "services/query-hooks/useGetSchoolSubjects";

function SchoolSubjects() {
    const { data: subjects } = useGetSchoolSubjects();

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
                    {subjects?.map(({ _id, name, description, grades_subjects }, i) => (
                        <Tr key={_id + i}>
                            <Td>{name}</Td>
                            <Td>
                                {grades_subjects?.map((s) => s.grade.standard).join(", ")}
                            </Td>
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
