import React, { forwardRef } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputProps,
  TextareaProps,
  Textarea,
} from '@chakra-ui/react';
import { FieldProps } from 'formik';

import { useUid } from 'hooks/useUid';

export type TextFieldProps = FieldProps &
  Omit<InputProps, 'name' | 'value' | 'error'> & {
    label?: string;
  };

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ field, form, ...props }, ref) {
    const id = useUid(props.id);
    const name = field.name;

    return (
      <FormControl isInvalid={!!(form.errors?.[name] && form.touched?.[name])}>
        <FormLabel fontWeight="bold" htmlFor={id}>
          {props?.label}
        </FormLabel>
        <Input {...field} id={id} {...props} ref={ref} />
        <FormErrorMessage>{form.errors?.[name]}</FormErrorMessage>
      </FormControl>
    );
  }
);

export type TextareaFieldProps = FieldProps &
  Omit<TextareaProps, 'name' | 'value' | 'error'> & {
    label?: string;
  };

export function TextareaField({ field, form, ...props }: TextareaFieldProps) {
  const id = useUid(props.id);
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
