import {
    Button,
    FormErrorMessage,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import QueryUser from "components/QueryUser/QueryUser";
import TextField from "components/TextField/TextField";
import { Formik, Form, Field } from "formik";
import React, { FC } from "react";
import * as yup from "yup";
import { AddGradeModalProps } from "./AddGradeModal";

export type AddSectionModal = AddGradeModalProps;

const AddSectionModal: FC<AddGradeModalProps> = ({ grades }) => {
    const { isOpen, onClose, onToggle } = useDisclosure();

    const SectionBodySchema = yup.object().shape({
        section: yup.string().max(50).min(1).required(),
        class_teacher: yup.string().email().required(),
        grade: yup.number().max(50).min(1).required(),
    });

    return (
        <>
            <Button variant="ghost" onClick={onToggle}>
                Add Section
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                size="4xl"
                closeOnEsc={false}
            >
                <ModalOverlay></ModalOverlay>
                <ModalContent>
                    <ModalHeader>Add Section</ModalHeader>
                    <ModalCloseButton />
                    {grades && grades.length > 0 ? (
                        <Formik
                            initialValues={{
                                section: "",
                                class_teacher: "",
                                grade: "",
                            }}
                            onSubmit={() => {
                                return;
                            }}
                            validationSchema={SectionBodySchema}
                        >
                            <Form>
                                <ModalBody>
                                    <Stack
                                        spacing="4"
                                        direction={["column", null, "row"]}
                                    >
                                        <Field
                                            component={TextField}
                                            name="section"
                                            placeholder="Section's Name"
                                            max={50}
                                            min={1}
                                        />
                                        <Field
                                            component={QueryUser}
                                            name="class_teacher"
                                            placeholder="Class Teacher's Email"
                                            required
                                        />
                                        {/* <Field
                                        component="select"
                                        name="grade"
                                        placeholder="Belonging Grade"
                                        required
                                    /> */}
                                        <Select placeholder="Belonging Grade">
                                            {grades?.map((grade, i) => (
                                                <option
                                                    key={i + Date.now()}
                                                    value={grade}
                                                >
                                                    {grade}
                                                </option>
                                            ))}
                                        </Select>
                                    </Stack>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        onClick={onClose}
                                        colorScheme="gray"
                                        variant="ghost"
                                    >
                                        Cancel
                                    </Button>
                                    <Button isLoading={false} type="submit">
                                        Create
                                    </Button>
                                </ModalFooter>
                                <FormErrorMessage>
                                    error && error.message
                                </FormErrorMessage>
                            </Form>
                        </Formik>
                    ) : (
                        <ModalBody>
                            <Text textAlign="center" color="red.400">
                                You haven't created any grade yet. Create a grade first
                                then you can create sections
                            </Text>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddSectionModal;
