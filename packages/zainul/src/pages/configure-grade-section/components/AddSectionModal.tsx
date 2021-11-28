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
import { MutationContextKey, QueryContextKey } from "configs/enums";
import { Formik, Form, Field } from "formik";
import useTitumirMutation from "hooks/useTitumirMutation";
import React, { FC } from "react";
import { useQueryClient } from "react-query";
import { CreateSectionBody } from "services/api/titumir";
import { useAuthStore } from "state/authorization-store";
import * as yup from "yup";
import { SectionSchema } from "@veschool/types";
import { AddGradeModalProps } from "./AddGradeModal";
import { FaPlusSquare } from "react-icons/fa";

export type AddSectionModal = AddGradeModalProps;

const AddSectionModal: FC<AddGradeModalProps> = ({ grades }) => {
    const { isOpen, onClose, onToggle } = useDisclosure();

    const SectionBodySchema = yup.object().shape({
        section: yup.string().max(50).min(1).required(),
        class_teacher: yup.string().email().required(),
        grade: yup.number().required(),
    });

    const short_name = useAuthStore((s) => s.user?.school?.short_name);

    const queryClient = useQueryClient();

    const { mutate: createSection, error } = useTitumirMutation<
        SectionSchema | null,
        CreateSectionBody
    >(
        MutationContextKey.CREATE_SECTION,
        async (api, data) => {
            if (!short_name) return null;
            const { json } = await api.createSection(short_name, data);
            return json;
        },
        {
            onSuccess() {
                queryClient.refetchQueries(QueryContextKey.GRADES);
            },
        },
    );

    return (
        <>
            <Button variant="ghost" onClick={onToggle} leftIcon={<FaPlusSquare />}>
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
                            onSubmit={(values, { resetForm, setSubmitting }) => {
                                createSection(values, {
                                    onSuccess() {
                                        setSubmitting(false);
                                        resetForm();
                                    },
                                    onError() {
                                        setSubmitting(false);
                                    },
                                });
                            }}
                            validationSchema={SectionBodySchema}
                        >
                            <Form>
                                <ModalBody>
                                    <Stack
                                        spacing="4"
                                        direction={["column", null, "row"]}
                                        align="center"
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

                                        <Field
                                            as={Select}
                                            name="grade"
                                            placeholder="Belonging Grade"
                                        >
                                            {grades?.map((grade, i) => (
                                                <option
                                                    key={i + Date.now()}
                                                    value={grade}
                                                >
                                                    {grade}
                                                </option>
                                            ))}
                                        </Field>
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
                                    {error && error.message}
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
