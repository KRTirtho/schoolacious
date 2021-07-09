import {
    IconButton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Link as Clink,
} from "@chakra-ui/react";
import React from "react";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { QueryContextKey } from "../../../configs/enums";
import useTitumirQuery from "../../../hooks/useTitumirQuery";
import { Grade } from "../../../services/api/titumir";
import { useAuthStore } from "../../../state/authorization-store";

function GradesList() {
    const school = useAuthStore((s) => s.user?.school);

    const { data: grades } = useTitumirQuery<Grade[]>(QueryContextKey.GRADES, (api) =>
        api.getGrades(school!.short_name).then(({ json }) => json),
    );

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Standard</Th>
                    <Th isNumeric>Edit</Th>
                </Tr>
            </Thead>
            <Tbody>
                {grades?.map((grade, i) => (
                    <Tr key={grade._id + i}>
                        <Td>
                            <Clink
                                as={Link}
                                to={`/school/${school?.short_name}/grade/${grade.standard}`}
                                color="green.400"
                                fontWeight="bold"
                            >
                                {grade.standard}
                            </Clink>
                        </Td>
                        <Td isNumeric>
                            <IconButton
                                variant="ghost"
                                aria-label="edit this grade"
                                icon={<FiEdit />}
                            />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}

export default GradesList;
