import { FieldProps } from "formik";
import React, { FC } from "react";
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Select,
    SelectProps,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";

export type SelectFieldProps = FieldProps &
    Omit<SelectProps, "name" | "error"> & { label?: string };

export const SelectField: FC<SelectFieldProps> = ({
    field,
    form,
    children,
    ...props
}) => {
    const id = props?.id ?? uuid();
    const name = field.name;

    return (
        <FormControl isInvalid={!!(form.errors?.[name] && form.touched?.[name])}>
            <FormLabel fontWeight="bold" htmlFor={id}>
                {props?.label}
            </FormLabel>
            <Select {...field} id={id} {...props}>
                {children}
            </Select>
            <FormErrorMessage>{form.errors?.[name]}</FormErrorMessage>
        </FormControl>
    );
};
