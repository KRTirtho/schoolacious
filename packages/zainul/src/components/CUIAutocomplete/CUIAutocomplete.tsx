import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    List,
    ListItem,
    Text,
    useOutsideClick,
} from "@chakra-ui/react";
import TextField, { TextFieldProps } from "components/TextField/TextField";
import React, { FC, useState, useEffect, useRef } from "react";
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

    const inputRef = useRef(null);
    const popoverContentRef = useRef(null);

    useOutsideClick({ ref: popoverContentRef, handler: () => setOpen(false) });

    return (
        <>
            <Popover
                isLazy
                closeOnEsc
                closeOnBlur
                trigger="click"
                isOpen={open}
                initialFocusRef={inputRef}
            >
                <PopoverTrigger>
                    <TextField
                        ref={inputRef}
                        field={field}
                        form={form}
                        meta={meta}
                        {...props}
                        id={id}
                        autoComplete="off"
                    />
                </PopoverTrigger>

                <PopoverContent ref={popoverContentRef}>
                    <PopoverBody>
                        <List maxH="sm" overflowY="auto">
                            {items.length > 0 ? (
                                items.map((item, i) => (
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
                                        <Text>{item.label}</Text>
                                        <Text color="gray.500">{item.value}</Text>
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <Text color="gray.500">Not found anything :'(</Text>
                                </ListItem>
                            )}
                        </List>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    );
};
