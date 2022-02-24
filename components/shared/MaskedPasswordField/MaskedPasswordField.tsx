import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { TextFieldProps } from '../TextField/TextField';
import { useUid } from 'hooks/useUid';

function MaskedPasswordField({ field, form, ...props }: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  function showHidePassword() {
    setShowPassword(!showPassword);
  }

  const id = useUid(props.id);
  const { name } = field;

  return (
    <FormControl isInvalid={!!(form.errors?.[name] && form.touched?.[name])}>
      <FormLabel htmlFor={id}>{props?.label}</FormLabel>
      <InputGroup>
        <Input
          type={showPassword ? 'text' : 'password'}
          {...field}
          id={id}
          {...props}
        />
        <InputRightElement onClick={showHidePassword} {...props}>
          {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{form.errors?.[name]}</FormErrorMessage>
    </FormControl>
  );
}

export default MaskedPasswordField;
