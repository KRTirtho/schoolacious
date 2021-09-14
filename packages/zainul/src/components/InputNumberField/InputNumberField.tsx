import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    NumberInput,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
    NumberInputField,
    NumberInputFieldProps,
} from "@chakra-ui/react";
import { FieldProps } from "formik";
import React, { forwardRef } from "react";
import { v4 as uuid } from "uuid";

export type InputNumberFieldProps = FieldProps &
    Omit<NumberInputFieldProps, "name" | "value" | "error"> & {
        label?: string;
        min?: number;
        max?: number;
    };

const InputNumberField = forwardRef<HTMLInputElement, InputNumberFieldProps>(
    function InputNumberField({ field, form, min, max, ...props }, ref) {
        const id = props.id ?? uuid();
        const name = field.name;

        return (
            <FormControl isInvalid={!!(form.errors?.[name] && form.touched?.[name])}>
                <FormLabel fontWeight="bold" htmlFor={id}>
                    {props?.label}
                </FormLabel>
                <NumberInput
                    {...field}
                    onChange={(_, value) =>
                        field.onChange({ target: { value, id, name } })
                    }
                    size="sm"
                    min={min}
                    max={max}
                >
                    <NumberInputField id={id} {...props} ref={ref} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{form.errors?.[name]}</FormErrorMessage>
            </FormControl>
        );
    },
);

export default InputNumberField;
