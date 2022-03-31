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
} from "@chakra-ui/react";
import QueryUser, { QueryUserProps } from "components/QueryUser/QueryUser";
import { Formik, Form, Field, FormikHelpers } from "formik";
import React, { FC, ReactElement } from "react";
import { FiEdit } from "react-icons/fi";
import * as yup from "yup";

interface AddUserPopoverProps
    extends Pick<QueryUserProps, "placeholder" | "label" | "filterUsers" | "roles"> {
    trigger?: ReactElement;
    onSubmit<Values extends Record<string, unknown>>(
        values: Values,
        formikHelpers: FormikHelpers<Values>,
        onClose: () => void,
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
    filterUsers,
    roles,
}) => {
    const { isOpen, onClose, onToggle, onOpen } = useDisclosure();

    return (
        <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
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
                <PopoverContent>
                    <Formik
                        initialValues={{ [name]: "" }}
                        onSubmit={(value, handler) => onSubmit(value, handler, onClose)}
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
                                    filterUsers={filterUsers}
                                    placeholder={placeholder}
                                    roles={roles}
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
