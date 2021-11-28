import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    HStack,
    IconButton,
    Text,
    chakra,
    useColorModeValue,
    theme,
} from "@chakra-ui/react";
import { Link, useRouteMatch } from "react-router-dom";
import { GradeSchema } from "@veschool/types";
import Paper from "components/Paper/Paper";
import React, { FC } from "react";
import { FaUsersCog } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { userToName } from "utils/userToName";
import GradeSubjectSelector from "./GradeSubjectSelector";

interface GradeAccordionProps {
    grade: GradeSchema;
}

const GradeAccordion: FC<GradeAccordionProps> = ({ grade }) => {
    const { path } = useRouteMatch();

    const { gradeColor, sectionColor } = useColorModeValue(
        { gradeColor: theme.colors.blue[600], sectionColor: theme.colors.cyan[800] },
        { gradeColor: theme.colors.blue[400], sectionColor: theme.colors.cyan[500] },
    );

    return (
        <AccordionItem w={["95%", "80%", "55%"]} border="none">
            <Paper colorScheme="tinted" p="5">
                <HStack justify="space-between">
                    <Text>
                        <chakra.b color={gradeColor}>Standard: </chakra.b>
                        {grade.standard}
                    </Text>
                    <GradeSubjectSelector
                        grade_subjects={grade.grades_subjects}
                        grade={grade.standard}
                    />
                </HStack>
                <Text>
                    <chakra.b color={gradeColor}>Moderator: </chakra.b>
                    {userToName(grade.moderator)}
                </Text>
                <Text>
                    <chakra.b color={gradeColor}>Examiner: </chakra.b>
                    {userToName(grade.examiner)}
                </Text>
                <AccordionButton>
                    <Text
                        fontWeight="semibold"
                        _hover={{ textDecoration: "underline" }}
                        flex={1}
                        textAlign="left"
                    >
                        Sections
                    </Text>
                    <AccordionIcon />
                </AccordionButton>
            </Paper>
            <AccordionPanel>
                {grade.sections?.map((section) => (
                    <Paper
                        _first={{ roundedTop: 5 }}
                        _last={{ roundedBottom: 5, pb: 2 }}
                        rounded={0}
                        colorScheme="tinted"
                        key={section._id}
                        pt="2"
                    >
                        <Text>
                            <chakra.b color={sectionColor}>Section: </chakra.b>
                            {section.name}
                        </Text>
                        <Text>
                            <chakra.b color={sectionColor}>CT: </chakra.b>
                            {userToName(section.class_teacher)}
                        </Text>
                        <HStack spacing="2">
                            <IconButton
                                as={Link}
                                colorScheme="gray"
                                aria-label="Configure section members"
                                icon={<FaUsersCog />}
                                to={`${path}/${grade.standard}/${section.name}/members`}
                            />
                            <IconButton
                                as={Link}
                                colorScheme="gray"
                                aria-label="Configure section classes"
                                icon={<SiGoogleclassroom />}
                                to={`${path}/${grade.standard}/${section.name}/classes`}
                            />
                        </HStack>
                    </Paper>
                ))}
            </AccordionPanel>
        </AccordionItem>
    );
};

export default GradeAccordion;
