import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    Button,
    useDisclosure,
    ModalOverlay,
    HStack,
} from "@chakra-ui/react";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirMutation from "hooks/useTitumirMutation";
import React from "react";
import { CreateSubjectBody } from "services/api/titumir";
import { useAuthStore } from "state/authorization-store";
import { SubjectSchema } from "@veschool/types";
import { Field, Form, Formik } from "formik";
import TextField, { TextareaField } from "components/TextField/TextField";
import * as yup from "yup";
import { useQueryClient } from "react-query";

function AddSubjectsModal() {
    const { isOpen, onToggle, onClose } = useDisclosure();

    const school = useAuthStore((s) => s.user?.school?.short_name);

    const queryClient = useQueryClient();

    const { mutate: createSubjects } = useTitumirMutation<
        SubjectSchema,
        CreateSubjectBody
    >(
        MutationContextKey.CREATE_SCHOOL_SUBJECTS,
        (api, data) => api.createSubjects(school!, data).then(({ json }) => json),
        {
            onSuccess() {
                queryClient.refetchQueries(QueryContextKey.SCHOOL_SUBJECTS);
            },
        },
    );

    const CreatSubjectSchema = yup.object().shape({
        subject: yup.string().min(1).max(50).required(),
        description: yup.string().required(),
    });

    return (
        <>
            <Button variant="ghost" onClick={onToggle}>
                Add Subjects
            </Button>
            <Modal isCentered isOpen={isOpen} onClose={onClose} closeOnEsc={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Grades</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Formik
                            initialValues={{ subject: "", description: "" }}
                            onSubmit={(
                                { description, subject },
                                { setSubmitting, resetForm },
                            ) => {
                                createSubjects(
                                    { name: subject, description },
                                    {
                                        onSuccess() {
                                            setSubmitting(false);
                                            resetForm();
                                        },
                                        onError() {
                                            setSubmitting(false);
                                        },
                                    },
                                );
                            }}
                            validationSchema={CreatSubjectSchema}
                        >
                            <Form>
                                <Field
                                    component={TextField}
                                    name="subject"
                                    placeholder="Subject Name"
                                />
                                <Field
                                    component={TextareaField}
                                    name="description"
                                    placeholder="Subject Description"
                                />
                                <HStack justify="flex-end" mt="2">
                                    <Button colorScheme="gray">Cancel</Button>
                                    <Button type="submit">Apply</Button>
                                </HStack>
                            </Form>
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddSubjectsModal;
