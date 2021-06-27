import { Container, Icon, Heading } from "@chakra-ui/react";
import React from "react";
import CreateSchoolForm from "../components/CreateSchoolForm";
import { FaSchool } from "react-icons/fa";

function SchoolCreate() {
    return (
        <Container direction="column" align={{ base: "stretch", md: "center" }}>
            <Heading as="h5" mb="2" textAlign="center" size="md">
                <Icon color="primary">
                    <FaSchool />
                </Icon>{" "}
                Create a School
            </Heading>
            <CreateSchoolForm />
        </Container>
    );
}

export default SchoolCreate;
