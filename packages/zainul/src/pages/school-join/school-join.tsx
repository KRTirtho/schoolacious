import {
    Avatar,
    Heading,
    HStack,
    IconButton,
    List,
    ListItem,
    Stack,
    Link as CLink,
    Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { FaGraduationCap } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { Link } from "react-router-dom";

function SchoolJoin() {
    const schools = Array.from({ length: 20 });

    return (
        <Stack>
            <HStack p="5" justify="space-between">
                <Heading size="md">List of Schools</Heading>
                <input type="search" />
            </HStack>

            <List>
                {schools.map((_, i) => (
                    <ListItem
                        p="5"
                        display="flex"
                        justifyContent="space-between"
                        w="full"
                        key={i}
                    >
                        <HStack>
                            <Avatar
                                as={Link}
                                to="/school/:short_name"
                                src="	https://www.designevo.com/res/templates/thumb_small/blue-shield-and-banner-emblem.webp"
                            />
                            <CLink as={Link} to="/school/:short_name">
                                School {i}
                            </CLink>
                        </HStack>
                        <HStack>
                            <Tooltip label="Join as a Student">
                                <IconButton
                                    variant="outline"
                                    aria-label="Join School as a student"
                                >
                                    <FaGraduationCap />
                                </IconButton>
                            </Tooltip>
                            <Tooltip label="Join as a teacher">
                                <IconButton variant="outline" aria-label="Join School">
                                    <GiTeacher />
                                </IconButton>
                            </Tooltip>
                        </HStack>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

export default SchoolJoin;
