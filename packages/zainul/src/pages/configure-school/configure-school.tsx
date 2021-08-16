import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";

function ConfigureSchool() {
    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Section</Th>
                    <Th>Class Teacher</Th>
                    <Th>Grade</Th>
                    <Th>Grade Moderator</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>A</Td>
                    <Td>Mr. No one</Td>
                    <Td>3</Td>
                    <Td>Ms. No one</Td>
                </Tr>
            </Tbody>
        </Table>
    );
}

export default ConfigureSchool;
