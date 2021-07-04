import { Button, Flex, Heading, Text, Image } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { confusedKid404 } from "../assets";

function NotFound404() {
    return (
        <Flex alignItems="center" direction="column">
            <Heading as="h2" size="xl">
                404
            </Heading>
            <Heading as="h4" size="md">
                Not Found
            </Heading>
            <Image maxW="10" h="auto" src={confusedKid404} alt="Confused?" />
            <Text colorScheme="textSecondary">Oops, sorry. The page isn't available</Text>
            <br />
            <Button component={Link} to="/">
                Back to Home
            </Button>
        </Flex>
    );
}

export default NotFound404;
