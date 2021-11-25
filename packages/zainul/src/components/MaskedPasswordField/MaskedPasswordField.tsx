import React, { ComponentPropsWithRef, ComponentType, useState } from "react";
import {
    FormControl,
    FormLabel,
    Input as ChakraInput,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { ActualFieldProps } from "../TextField/TextField";
import { Input } from "react-binden";

function MaskedPasswordField({
    required,
    pattern,
    max,
    maxLength,
    min,
    minLength,
    ...props
}: ActualFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    function showHidePassword() {
        setShowPassword(!showPassword);
    }

    const id = props.id ?? uuid();

    return (
        <FormControl isInvalid={!!(props.model.error && props.model.touched)}>
            <FormLabel htmlFor={id}>{props?.label}</FormLabel>
            <InputGroup>
                <Input
                    type={showPassword ? "text" : "password"}
                    id={id}
                    {...props}
                    required={required}
                    {...{ pattern, max, maxLength, min, minLength }}
                    as={ChakraInput as ComponentType<ComponentPropsWithRef<"input">>}
                />
                <InputRightElement onClick={showHidePassword} {...props}>
                    {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{props.model.error}</FormErrorMessage>
        </FormControl>
    );
}

export default MaskedPasswordField;
