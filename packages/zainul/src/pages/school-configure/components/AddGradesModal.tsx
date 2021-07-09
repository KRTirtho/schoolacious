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
} from "@chakra-ui/react";
import { IoIosAddCircle } from "react-icons/io";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import useTitumirMutation from "../../../hooks/useTitumirMutation";
import { useAuthStore } from "../../../state/authorization-store";
import { Grade, GradeBody } from "../../../services/api/titumir";
import { MutationContextKey } from "../../../configs/enums";

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

    const { mutate: createGrades, isLoading } = useTitumirMutation<Grade[], GradeBody[]>(
        MutationContextKey.CREATE_GRADES,
        (api, body) =>
            api.createGrades(user!.school!.short_name, body).then(({ json }) => json),
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
                                <ListItem key={standard + i}>{standard}</ListItem>
                            ))}
                        </List>
                        <Flex justify="center">
                            <form onSubmit={handleSubmit} onReset={handleReset}>
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
                            </form>
                        </Flex>
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
