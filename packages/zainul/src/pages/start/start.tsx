import { Flex } from "@chakra-ui/react";
import React from "react";
import NoSchool from "./components/NoSchool";
import { useAuthStore } from "state/authorization-store";
import { UpcomingClasses } from "./components/UpcomingClasses";

function Start() {
    const user = useAuthStore((s) => s.user);

    return <Flex>{!user?.school ? <NoSchool /> : <UpcomingClasses />}</Flex>;
}

export default Start;
