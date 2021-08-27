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
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    Text,
} from "@chakra-ui/react";
import { QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import React, { useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { Link } from "react-router-dom";
import { SchoolSchema } from "@veschool/types";
import { FiSearch } from "react-icons/fi";

function SchoolJoin() {
    const [query, setQuery] = useState<string>("");

    const {
        data: schools,
        refetch,
        isLoading,
    } = useTitumirQuery<SchoolSchema[]>(QueryContextKey.SCHOOL, (api) =>
        api.getOrSearchSchool(query).then(({ json }) => json),
    );

    return (
        <Stack>
            <HStack p="5" justify="space-between">
                <Heading size="md">List of Schools</Heading>
                <InputGroup w="xs">
                    <InputLeftElement>
                        <FiSearch />
                    </InputLeftElement>
                    <Input
                        onKeyPress={(e) => e.key === "Enter" && console.log(e)}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Filter schools..."
                        borderRightRadius="none"
                    />
                    <Button
                        borderLeftRadius="none"
                        onClick={() => refetch()}
                        isLoading={isLoading}
                    >
                        Search
                    </Button>
                </InputGroup>
            </HStack>

            <List>
                {schools?.map(({ _id, short_name, name }, i) => (
                    <ListItem
                        p="5"
                        display="flex"
                        justifyContent="space-between"
                        w="full"
                        key={_id + i}
                    >
                        <HStack>
                            <Avatar
                                as={Link}
                                to={`/school/${_id}`}
                                src="	https://www.designevo.com/res/templates/thumb_small/blue-shield-and-banner-emblem.webp"
                            />
                            <CLink as={Link} to={`/school/${_id}`}>
                                {name}
                            </CLink>
                            <Text color="gray">@{short_name}</Text>
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
