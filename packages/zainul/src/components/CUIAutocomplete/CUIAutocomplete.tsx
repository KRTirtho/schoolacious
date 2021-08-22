import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    List,
    ListItem,
} from "@chakra-ui/react";
import TextField, { TextFieldProps } from "components/TextField/TextField";
import React, { FC, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

export interface CUIAutocompleteProps extends Omit<TextFieldProps, "multiline"> {
    items: { label: string; value: string }[];
    isOpen?: boolean;
}

export const CUIAutocomplete: FC<CUIAutocompleteProps> = ({
    items,
    field,
    form,
    meta,
    isOpen,
    ...props
}) => {
    const id = props.id ?? uuid();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        isOpen && setOpen(isOpen);
    }, [isOpen]);

    return (
        <>
            <Popover isLazy closeOnEsc closeOnBlur trigger="click" isOpen={open}>
                <PopoverTrigger>
                    <TextField
                        field={field}
                        form={form}
                        meta={meta}
                        {...props}
                        id={id}
                        autoComplete="off"
                    />
                </PopoverTrigger>

                <PopoverContent>
                    <PopoverBody>
                        <List maxH="sm" overflowY="auto">
                            {items.map((item, i) => (
                                <ListItem
                                    _hover={{
                                        bg: "green.100",
                                    }}
                                    onClick={() => {
                                        field.onChange({
                                            target: {
                                                value: item.value,
                                                name: field.name,
                                                id,
                                            },
                                        });
                                        setOpen(false);
                                    }}
                                    p="2"
                                    key={item.label + i}
                                >
                                    {item.label}
                                </ListItem>
                            ))}
                        </List>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    );
};
