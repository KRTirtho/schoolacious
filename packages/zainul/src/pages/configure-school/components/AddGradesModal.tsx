import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    IconButton,
    Flex,
    List,
    ListItem,
    NumberInput,
    NumberInputField,
    FormControl,
    FormErrorMessage,
    Text,
    HStack,
} from "@chakra-ui/react";
import { IoIosAddCircle } from "react-icons/io";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import useTitumirMutation from "../../../hooks/useTitumirMutation";
import { useAuthStore } from "../../../state/authorization-store";
import { Grade, GradeBody } from "../../../services/api/titumir";
import { MutationContextKey, QueryContextKey } from "../../../configs/enums";
import { FaRegTimesCircle } from "react-icons/fa";
import { useQueryClient } from "react-query";

function AddGradesModal() {
    const user = useAuthStore((s) => s.user);
    const { isOpen, onClose, onToggle } = useDisclosure();
    const [standards, setStandards] = useState<number[]>([]);
    const {
        handleChange,
        handleBlur,
        values,
        handleSubmit,
        handleReset,
        errors,
        touched,
        resetForm,
    } = useFormik({
        initialValues: {
            standard: "",
        },
        onSubmit({ standard }, { resetForm }) {
            setStandards(Array.from(new Set([...standards, parseInt(standard)])));
            resetForm();
        },
        validationSchema: yup.object().shape({
            standard: yup.number().min(1).max(20).required(),
        }),
    });

    const queryClient = useQueryClient();

    const { mutate: createGrades, isLoading } = useTitumirMutation<Grade[], GradeBody[]>(
        MutationContextKey.CREATE_GRADES,
        (api, body) =>
            api.createGrades(user!.school!.short_name, body).then(({ json }) => json),
        {
            onSuccess(data) {
                queryClient.setQueryData<Grade[]>(QueryContextKey.GRADES, (previous) => [
                    ...(previous ?? []),
                    ...data,
                ]);
            },
        },
    );

    function handleClose() {
        resetForm();
        setStandards([]);
        onClose();
    }

    function handleSubmission() {
        createGrades(
            standards.map((standard) => ({ standard })),
            { onSuccess: handleClose },
        );
    }

    return (
        <>
            <Button variant="ghost" onClick={onToggle}>
                Add Grades
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Grade</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <List>
                            {standards.map((standard, i) => (
                                <ListItem
                                    _even={{ bg: "primary.100" }}
                                    key={standard + i}
                                    px="2"
                                >
                                    <HStack justify="space-between">
                                        <Text>{standard}</Text>
                                        <IconButton
                                            variant="ghost"
                                            aria-label="delete create grade"
                                            icon={<FaRegTimesCircle />}
                                            onClick={() => {
                                                setStandards(
                                                    standards.filter(
                                                        (olStandard) =>
                                                            olStandard !== standard,
                                                    ),
                                                );
                                            }}
                                        />
                                    </HStack>
                                </ListItem>
                            ))}
                        </List>
                        <form onSubmit={handleSubmit} onReset={handleReset}>
                            <Flex justify="center">
                                <FormControl
                                    isInvalid={!!errors.standard && touched.standard}
                                >
                                    <NumberInput w="full" min={1} max={20}>
                                        <NumberInputField
                                            name="standard"
                                            value={values.standard}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </NumberInput>
                                    <FormErrorMessage>{errors.standard}</FormErrorMessage>
                                </FormControl>
                                <IconButton
                                    type="submit"
                                    aria-label="add grade standard"
                                    icon={<IoIosAddCircle />}
                                    variant="ghost"
                                />
                            </Flex>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleClose} colorScheme="gray" variant="ghost">
                            Cancel
                        </Button>
                        <Button
                            isLoading={isLoading}
                            disabled={standards.length === 0}
                            onClick={handleSubmission}
                        >
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddGradesModal;
