import React, { FC, useEffect, useMemo, useState } from "react";
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    IconButton,
    List,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { FiUserPlus } from "react-icons/fi";
import CUISelect from "components/CUISelect/CUISelect";
import { OptionsType, OptionTypeBase } from "react-select";
import ListAvatarTile from "components/ListAvatarTile/ListAvatarTile";
import { TiCancel } from "react-icons/ti";
import useTitumirQuery from "hooks/useTitumirQuery";
import { QueryContextKey } from "configs/enums";
import { UserSchema, USER_ROLE } from "@schoolacious/types";
import { userToName } from "utils/userToName";

export interface OptionType extends OptionTypeBase {
    label: React.ReactElement;
    labelStr: string;
    value: string;
}

export interface AddMultipleUserSlideProps {
    heading?: string;
    triggerTitle?: string;
    onSubmit(selectedItem: OptionsType<OptionType>, onClose: () => void): void;
    placeholder?: string;
    submitTitle?: string;
    "query-filters"?: { school_id?: string; roles?: USER_ROLE[] };
    "filter-users"?: (user: UserSchema) => boolean;
}

const AddMultipleUserSlide: FC<AddMultipleUserSlideProps> = ({
    heading = "Add Users",
    triggerTitle = "Add Users",
    submitTitle = "Apply",
    onSubmit,
    placeholder,
    "query-filters": queryFilters,
    "filter-users": filterUsers,
}) => {
    const { isOpen, onClose: handleClose, onOpen: handleOpen } = useDisclosure();

    const {
        data: optionsRaw,
        refetch,
        isLoading,
    } = useTitumirQuery<UserSchema[]>(
        QueryContextKey.QUERY_USER,
        (api) => api.user.query(query, queryFilters).then(({ json }) => json),
        {
            enabled: false,
        },
    );

    const [selectedItems, setSelectedItems] = useState<OptionsType<OptionType>>([]);

    const selectedValue = selectedItems.map(({ value }) => value);

    const options: OptionsType<OptionType> = useMemo(() => {
        const options = [];

        for (const user of optionsRaw ?? []) {
            const isNotSelectedVal = !selectedValue.includes(user._id);
            const isAllowed = filterUsers?.(user);

            if (
                (isAllowed !== undefined && isAllowed && isNotSelectedVal) ||
                isNotSelectedVal
            ) {
                options.push({
                    value: user._id,
                    label: (
                        <div>
                            <Text>{userToName(user)}</Text>
                            <Text color="gray.500">{user.email}</Text>
                        </div>
                    ),
                    labelStr: userToName(user),
                });
            }
        }

        return options;
    }, [optionsRaw, selectedValue]);

    const [query, setQuery] = useState("");

    useEffect(() => {
        if (query.trim().length > 0) refetch();
    }, [query]);

    function handleSelectChange(
        value: OptionsType<OptionTypeBase> | OptionTypeBase | null,
    ) {
        setSelectedItems((value as OptionsType<OptionType>) ?? []);
    }

    function handleSelectInputChange(value: string) {
        value !== query && setQuery(value);
    }

    function removeSelectedItems(value: string) {
        setSelectedItems(selectedItems.filter((item) => item.value != value));
    }

    return (
        <>
            <Button
                variant="ghost"
                isFullWidth
                onClick={handleOpen}
                leftIcon={<FiUserPlus />}
            >
                {triggerTitle}
            </Button>

            <Drawer placement="right" onClose={handleClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>{heading}</DrawerHeader>

                    <DrawerBody>
                        <CUISelect
                            isMulti
                            onChange={handleSelectChange}
                            closeMenuOnSelect={false}
                            isSearchBar
                            isLoading={isLoading}
                            options={options}
                            value={selectedItems}
                            inputValue={query}
                            onInputChange={handleSelectInputChange}
                            placeholder={placeholder}
                            noOptionsMessage={() => "No one found ;("}
                        />
                        <Button
                            disabled={selectedItems.length === 0}
                            display="block"
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedItems([])}
                            my="1"
                            ml="auto"
                        >
                            Clear All
                        </Button>
                        <List>
                            {selectedItems.map(({ value, labelStr }, index) => {
                                return (
                                    <ListAvatarTile
                                        key={labelStr + value + index}
                                        name={labelStr}
                                        ending={
                                            <IconButton
                                                aria-label="remove selected user"
                                                variant="ghost"
                                                icon={<TiCancel />}
                                                onClick={() => removeSelectedItems(value)}
                                            />
                                        }
                                    />
                                );
                            })}
                        </List>
                    </DrawerBody>
                    <DrawerFooter>
                        <HStack spacing="2">
                            <Button onClick={handleClose} colorScheme="gray">
                                Cancel
                            </Button>
                            <Button
                                disabled={selectedItems.length === 0}
                                isLoading={isLoading}
                                onClick={() => onSubmit(selectedItems, handleClose)}
                            >
                                {submitTitle}
                            </Button>
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default AddMultipleUserSlide;
