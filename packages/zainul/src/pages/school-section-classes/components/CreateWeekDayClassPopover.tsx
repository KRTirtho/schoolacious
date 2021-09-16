import {
    Button,
    Heading,
    HStack,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    Link as CLink,
} from "@chakra-ui/react";
import InputNumberField from "components/InputNumberField/InputNumberField";
import TextField from "components/TextField/TextField";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { FC } from "react";
import { FiCheck, FiPlus } from "react-icons/fi";
import { TiTimes } from "react-icons/ti";
import * as yup from "yup";
import { TeachersToSectionsToGradesSchema } from "@veschool/types";
import { userToName } from "utils/userToName";
import { Link } from "react-router-dom";
import { SelectField } from "components/SelectField/SelectField";

interface CreatClassBodySchema {
    host: string;
    duration: string;
    time: string;
}

export interface CreateWeekDayClassPopoverProps {
    day: string;
    sectionTeachers?: TeachersToSectionsToGradesSchema[] | null;
    onSubmit: (
        values: CreatClassBodySchema,
        formikHelpers: FormikHelpers<CreatClassBodySchema>,
    ) => void | Promise<unknown>;
}

const CreateWeekDayClassPopover: FC<CreateWeekDayClassPopoverProps> = ({
    day,
    sectionTeachers,
    onSubmit,
}) => {
    const CreateClassSchema = yup.object().shape({
        host: yup.string().required(),
        duration: yup.number().required().max(60).min(10),
        time: yup.string().required(),
    });

    return (
        <Popover isLazy>
            <PopoverTrigger>
                <IconButton
                    title="new class entry in routine"
                    size="lg"
                    variant="ghost"
                    aria-label="Add class"
                    icon={<FiPlus />}
                    w="28"
                    h="28"
                />
            </PopoverTrigger>
            <PopoverContent style={{ margin: 0 }}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                    <Heading size="sm">{day}</Heading>
                </PopoverHeader>
                <PopoverBody>
                    {sectionTeachers && sectionTeachers.length > 0 ? (
                        <Formik
                            initialValues={{
                                host: "",
                                duration: "",
                                time: "",
                            }}
                            validationSchema={CreateClassSchema}
                            onSubmit={onSubmit}
                        >
                            <Form>
                                <Field name="host" component={SelectField}>
                                    <option value="">Select a teacher</option>
                                    {sectionTeachers.map((teacher, i) => (
                                        <option
                                            key={teacher._id + i}
                                            value={teacher.user._id}
                                        >
                                            {userToName(teacher.user)}
                                        </option>
                                    ))}
                                </Field>

                                <Field
                                    component={InputNumberField}
                                    name="duration"
                                    placeholder="Duration in Minutes"
                                    min={10}
                                    max={60}
                                />

                                <Field component={TextField} type="time" name="time" />

                                <HStack mt="2" justify="flex-end">
                                    <Button
                                        size="sm"
                                        leftIcon={<TiTimes />}
                                        colorScheme="gray"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        type="submit"
                                        leftIcon={<FiCheck />}
                                    >
                                        Add
                                    </Button>
                                </HStack>
                            </Form>
                        </Formik>
                    ) : (
                        <Text>
                            No teachers available in this section.{" "}
                            <CLink
                                color="blue.400"
                                as={Link}
                                to="/school/configure/grade-sections"
                            >
                                Assign teachers
                            </CLink>{" "}
                            in the section to create classes
                        </Text>
                    )}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default CreateWeekDayClassPopover;
