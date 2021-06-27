import { Flex } from "@chakra-ui/react";
import React from "react";
import NoSchool from "../components/NoSchool";
import useAuthorization from "../hooks/useAuthorization";

function Start() {
    const { user } = useAuthorization();

    return <Flex>{!user?.school && <NoSchool />}</Flex>;
}

export default Start;
