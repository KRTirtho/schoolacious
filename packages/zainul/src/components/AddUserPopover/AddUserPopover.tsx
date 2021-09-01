import {
    Popover,
    PopoverTrigger,
    IconButton,
    Portal,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    HStack,
    Button,
    useDisclosure,
    useOutsideClick,
} from "@chakra-ui/react";
import QueryUser from "components/QueryUser/QueryUser";
import { TextFieldProps } from "components/TextField/TextField";
import { Formik, Form, Field, FormikHelpers } from "formik";
import React, { FC, ReactElement, useRef } from "react";
import { FiEdit } from "react-icons/fi";
import * as yup from "yup";

interface AddUserPopoverProps extends Pick<TextFieldProps, "placeholder" | "label"> {
    trigger?: ReactElement;
    onSubmit<Values extends Record<string, unknown>>(
        values: Values,
        formikHelpers: FormikHelpers<Values>,
    ): void | Promise<unknown>;
    name: string;
    heading?: string;
}

export const AddUserPopover: FC<AddUserPopoverProps> = ({
    trigger,
    onSubmit,
    name,
    heading,
    placeholder,
    label,
}) => {
    const { isOpen, onClose, onToggle } = useDisclosure();
    const popoverContentRef = useRef(null);

    useOutsideClick({ ref: popoverContentRef, handler: onClose });

    return (
        <Popover isLazy isOpen={isOpen}>
            <PopoverTrigger>
                {trigger ? (
                    React.cloneElement(trigger, { onClick: onToggle })
                ) : (
                    <IconButton
                        size="sm"
                        mx="2"
                        colorScheme="gray"
                        aria-label="Edit Co Admin 1"
                        onClick={onToggle}
                    >
                        <FiEdit />
                    </IconButton>
                )}
            </PopoverTrigger>
            <Portal>
                <PopoverContent ref={popoverContentRef}>
                    <Formik
                        initialValues={{ [name]: "" }}
                        onSubmit={onSubmit}
                        validationSchema={yup.object().shape({
                            [name]: yup.string().email().required(),
                        })}
                    >
                        <Form>
                            <PopoverArrow />
                            <PopoverCloseButton onClick={onClose} />
                            <PopoverHeader>{heading ?? "Add User"}</PopoverHeader>
                            <PopoverBody>
                                <Field
                                    label={label}
                                    name={name}
                                    component={QueryUser}
                                    placeholder={placeholder}
                                />
                            </PopoverBody>
                            <PopoverFooter>
                                <HStack spacing="2" justify="flex-end">
                                    <Button m="0" colorScheme="gray" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Apply</Button>
                                </HStack>
                            </PopoverFooter>
                        </Form>
                    </Formik>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};
