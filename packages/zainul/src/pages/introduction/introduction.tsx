import React from "react";
import { Box, Flex, Button, Heading } from "@chakra-ui/react";
import { introductionBG as bgImg } from "../../assets";
import { Link } from "react-router-dom";

export default function Introduction() {
    return (
        <Flex
            direction="column"
            alignItems="center"
            justify="center"
            bgPos="top"
            h="100vh"
            pos="relative"
            bg={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImg})`}
        >
            <Box pos="absolute" top="0" right="0" margin={2}>
                <Button as={Link} to="/auth">
                    Sign up
                </Button>
            </Box>
            <Heading as="h1" size="3xl" color="white">
                Schoolacious
            </Heading>
            <Box maxW="50%">
                <Heading as="h5" size="md" textAlign="center" color="white">
                    A destination where all the reading sound📔 of small learners🧒 & day
                    to day learning👩‍🏫 takes place bringing up all the thing a student👩‍🎓
                    used to do before Quarantine & Pandemic🦠
                </Heading>
            </Box>
            <Flex
                justify="space-between"
                alignItems="center"
                maxW="18rem"
                wrap="nowrap"
                direction="row"
            >
                <Button component={Link} to="/auth">
                    Get Started
                </Button>
            </Flex>
        </Flex>
    );
}
