import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    HStack,
    Text,
    chakra,
    useColorModeValue,
    theme,
    Icon,
    VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { GradeSchema } from "@schoolacious/types";
import Paper from "components/Paper/Paper";
import React, { FC } from "react";
import { FaAngleRight } from "react-icons/fa";
import { userToName } from "utils/userToName";
import GradeSubjectSelector from "./GradeSubjectSelector";

interface GradeAccordionProps {
    grade: GradeSchema;
}

const GradeAccordion: FC<GradeAccordionProps> = ({ grade }) => {
    const { gradeColor, sectionColor } = useColorModeValue(
        { gradeColor: theme.colors.blue[600], sectionColor: theme.colors.cyan[800] },
        { gradeColor: theme.colors.blue[400], sectionColor: theme.colors.cyan[500] },
    );

    const navigate = useNavigate();

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
                        _hover={{ filter: "brightness(0.95)" }}
                        colorScheme="tinted"
                        my={2}
                        _last={{ mb: 0 }}
                        key={section._id}
                        py="2"
                        cursor="pointer"
                        onClick={() => navigate(`${grade.standard}/${section.name}`)}
                    >
                        <HStack justify="space-between">
                            <VStack align="flex-start">
                                <Text>
                                    <chakra.b color={sectionColor}>Section: </chakra.b>
                                    {section.name}
                                </Text>
                                <Text>
                                    <chakra.b color={sectionColor}>CT: </chakra.b>
                                    {userToName(section.class_teacher)}
                                </Text>
                            </VStack>
                            <Icon>
                                <FaAngleRight />
                            </Icon>
                        </HStack>
                    </Paper>
                ))}
            </AccordionPanel>
        </AccordionItem>
    );
};

export default GradeAccordion;
