import React, { ComponentPropsWithRef, ComponentType, forwardRef } from "react";
import {
    FormControl,
    FormLabel,
    Input as ChakraInput,
    FormErrorMessage,
    InputProps as ChakraInputProps,
    TextareaProps,
    Textarea,
} from "@chakra-ui/react";
import { FieldProps } from "formik";
import { v4 as uuid } from "uuid";
import { Input, InputProps, SemanticValidationProps } from "react-binden";

export type TextFieldProps = FieldProps &
    Omit<ChakraInputProps, "name" | "value" | "error"> & {
        label?: string;
    };

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
    { field, form, ...props },
    ref,
) {
    const id = props.id ?? uuid();
    const name = field.name;

    return (
        <FormControl isInvalid={!!(form.errors?.[name] && form.touched?.[name])}>
            <FormLabel fontWeight="bold" htmlFor={id}>
                {props?.label}
            </FormLabel>
            <ChakraInput {...field} id={id} {...props} ref={ref} />
            <FormErrorMessage>{form.errors?.[name]}</FormErrorMessage>
        </FormControl>
    );
});

export type TextareaFieldProps = FieldProps &
    Omit<TextareaProps, "name" | "value" | "error"> & {
        label?: string;
    };

export function TextareaField({ field, form, ...props }: TextareaFieldProps) {
    const id = props.id ?? uuid();
    const name = field.name;
    return (
        <FormControl isInvalid={!!(form.errors?.[name] && form.touched?.[name])}>
            <FormLabel fontWeight="bold" htmlFor={id}>
                {props?.label}
            </FormLabel>
            <Textarea {...field} id={id} {...props} />
            <FormErrorMessage>{form.errors?.[name]}</FormErrorMessage>
        </FormControl>
    );
}

export default TextField;

export type ActualFieldProps = InputProps &
    Omit<ChakraInputProps, SemanticValidationProps | "as"> & {
        label?: string;
    };

export const ActualField = forwardRef<HTMLInputElement, ActualFieldProps>(
    function ActualField({ label = "", ...props }, ref) {
        return (
            <FormControl isInvalid={!!(props.model.error && props.model.touched)}>
                <FormLabel>{label}</FormLabel>
                <Input
                    as={ChakraInput as ComponentType<ComponentPropsWithRef<"input">>}
                    {...props}
                    ref={ref}
                />
                <FormErrorMessage>{props.model.error}</FormErrorMessage>
            </FormControl>
        );
    },
);
