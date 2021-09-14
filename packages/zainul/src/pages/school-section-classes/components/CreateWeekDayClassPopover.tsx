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
    Select,
    Text,
} from "@chakra-ui/react";
import InputNumberField from "components/InputNumberField/InputNumberField";
import TextField from "components/TextField/TextField";
import { Field, Form, Formik } from "formik";
import React, { FC } from "react";
import { FiCheck, FiPlus } from "react-icons/fi";
import { TiTimes } from "react-icons/ti";
import * as yup from "yup";
import { TeachersToSectionsToGradesSchema } from "@veschool/types";
import { userToName } from "utils/userToName";

export interface CreateWeekDayClassPopoverProps {
    day: string;
    sectionTeachers?: TeachersToSectionsToGradesSchema[] | null;
}

const CreateWeekDayClassPopover: FC<CreateWeekDayClassPopoverProps> = ({
    day,
    sectionTeachers,
}) => {
    const CreateClassSchema = yup.object().shape({
        host: yup.string().required(),
        duration: yup.number().required().max(60).min(10),
        time: yup.string().required(),
    });

    return (
        <Popover>
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
            <PopoverContent>
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
                            onSubmit={() => {
                                return;
                            }}
                        >
                            <Form>
                                <Field mt="3" component={Select} name="host">
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
                            No teachers available in this section. Assign teachers in the
                            section to create classes
                        </Text>
                    )}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default CreateWeekDayClassPopover;
