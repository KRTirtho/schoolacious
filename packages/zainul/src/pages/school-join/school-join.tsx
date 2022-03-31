import React, { useState } from "react";
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
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import { FaGraduationCap } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { Link } from "react-router-dom";
import {
    Invitations_JoinsSchema,
    INVITATION_OR_JOIN_ROLE,
    SchoolSchema,
} from "@schoolacious/types";
import { FiSearch } from "react-icons/fi";
import useTitumirMutation from "hooks/useTitumirMutation";
import { JoinRequestProperties } from "services/titumir-client/modules/invitation-join";
import { useQueryClient } from "react-query";

function SchoolJoin() {
    const [query, setQuery] = useState<string>("");

    const {
        data: schools,
        refetch,
        isLoading,
    } = useTitumirQuery<SchoolSchema[]>(QueryContextKey.SCHOOLS, (api) =>
        api.school.list({ noInviteJoin: true, search: query }).then(({ json }) => json),
    );

    const queryClient = useQueryClient();

    const { mutate: joinSchool } = useTitumirMutation<
        Invitations_JoinsSchema,
        JoinRequestProperties
    >(
        MutationContextKey.JOIN_SCHOOL,
        (api, data) =>
            api.invitationJoin.createJoinRequest(data).then(({ json }) => json),
        {
            onSuccess() {
                queryClient.refetchQueries(QueryContextKey.SCHOOLS);
            },
        },
    );

    return (
        <Stack>
            <Stack
                p="5"
                justify="space-between"
                flexDirection={["column", "row"]}
                align="center"
            >
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
            </Stack>

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
                            <div>
                                <CLink as={Link} to={`/school/${_id}`}>
                                    {name}
                                </CLink>
                                <Text color="gray">@{short_name}</Text>
                            </div>
                        </HStack>
                        <HStack>
                            <Tooltip label="Join as a Student">
                                <IconButton
                                    variant="outline"
                                    aria-label="Join School as a student"
                                    onClick={() => {
                                        joinSchool({
                                            school_id: _id,
                                            role: INVITATION_OR_JOIN_ROLE.student,
                                        });
                                    }}
                                >
                                    <FaGraduationCap />
                                </IconButton>
                            </Tooltip>
                            <Tooltip label="Join as a teacher">
                                <IconButton
                                    variant="outline"
                                    aria-label="Join School"
                                    onClick={() => {
                                        joinSchool({
                                            school_id: _id,
                                            role: INVITATION_OR_JOIN_ROLE.teacher,
                                        });
                                    }}
                                >
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
