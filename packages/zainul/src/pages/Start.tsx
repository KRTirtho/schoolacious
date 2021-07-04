import { Flex } from "@chakra-ui/react";
import React from "react";
import NoSchool from "../components/NoSchool";
import { useAuthStore } from "../state/auth-provider";

function Start() {
    const user = useAuthStore((s) => s.user);

    return <Flex>{!user?.school && <NoSchool />}</Flex>;
}

export default Start;
