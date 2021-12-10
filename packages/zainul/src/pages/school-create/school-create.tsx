import React from "react";
import CreateSchoolForm from "./components/CreateSchoolForm";
import { Container, Icon, Heading } from "@chakra-ui/react";
import { FaSchool } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "state/authorization-store";

function SchoolCreate() {
    const user = useAuthStore((s) => s.user);

    return (
        <Container direction="column" align={{ base: "stretch", md: "center" }}>
            <Heading as="h5" mb="2" textAlign="center" size="md">
                <Icon color="primary">
                    <FaSchool />
                </Icon>{" "}
                Create a School
            </Heading>
            <CreateSchoolForm />
            {user?.school && <Navigate to="/school" />}
        </Container>
    );
}

export default SchoolCreate;
