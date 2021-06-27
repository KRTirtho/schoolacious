import { Button, Text, Image, Stack, HStack } from "@chakra-ui/react";
import React from "react";
import { lonelyKid } from "../configurations/img-imports";
import { FaSchool, FaUserGraduate } from "react-icons/fa";
import { Link } from "react-router-dom";

function NoSchool() {
    return (
        <Stack
            flex={1}
            direction="column"
            alignItems="center"
            justify="center"
            spacing="10"
        >
            <Image
                maxW="15rem"
                h="auto"
                src={lonelyKid}
                draggable={false}
                alt="Don't be alone"
            />
            <Text my="5" color="textSecondary" variant="h6">
                You haven't joined a school yet
            </Text>
            <HStack>
                <Button
                    as={Link}
                    variant="outline"
                    leftIcon={<FaSchool />}
                    to="/school/create"
                >
                    Create a School
                </Button>
                <Button variant="outline" rightIcon={<FaUserGraduate />}>
                    Join a School
                </Button>
            </HStack>
        </Stack>
    );
}

export default NoSchool;
