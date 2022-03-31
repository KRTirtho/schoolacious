import { Button, Text, Image, Stack, VStack } from "@chakra-ui/react";
import React from "react";
import { lonelyKid } from "assets";
import { FaSchool, FaUserGraduate } from "react-icons/fa";
import { Link } from "react-router-dom";

function NoSchool() {
    return (
        <VStack flex={1} alignItems="center" justify="center" spacing="10">
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
            <Stack flexDir={["column", null, "row"]} spacing="2">
                <Button
                    as={Link}
                    variant="outline"
                    leftIcon={<FaSchool />}
                    to="/school/create"
                    isFullWidth
                    mr={[null, null, "2"]}
                    mb={["2", null, null]}
                >
                    Create a School
                </Button>
                <Button
                    style={{
                        margin: 0,
                    }}
                    as={Link}
                    to="/school/join"
                    variant="outline"
                    rightIcon={<FaUserGraduate />}
                    isFullWidth
                >
                    Join a School
                </Button>
            </Stack>
        </VStack>
    );
}

export default NoSchool;
