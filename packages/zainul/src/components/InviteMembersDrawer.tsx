import React, { useState } from "react";
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
    useDisclosure,
} from "@chakra-ui/react";
import { FiUserPlus } from "react-icons/fi";
import CUISelect from "./shared/CUISelect";
import { OptionsType, OptionTypeBase } from "react-select";
import ListAvatarTile from "./shared/ListAvatarTile";
import { TiCancel } from "react-icons/ti";

function InviteMembersDrawer() {
    const { isOpen, onClose: handleClose, onOpen: handleOpen } = useDisclosure();

    const options: OptionsType<OptionTypeBase> = Array.from({ length: 20 }, (_, i) => ({
        label: `Naha ${i}`,
        value: `wow ${i}`,
    }));

    const [selectedItems, setSelectedItems] = useState<OptionsType<OptionTypeBase>>([]);

    return (
        <>
            <Button variant="ghost" onClick={handleOpen} leftIcon={<FiUserPlus />}>
                Invite Members
            </Button>

            <Drawer placement="right" onClose={handleClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Invite new members</DrawerHeader>

                    <DrawerBody>
                        <CUISelect
                            isMulti
                            onChange={(values) => {
                                setSelectedItems(
                                    (values as OptionsType<OptionTypeBase>) ?? [],
                                );
                            }}
                            closeMenuOnSelect={false}
                            isSearchBar
                            options={options}
                            value={selectedItems}
                            placeholder="Search with email/username..."
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
                            {selectedItems.map(({ label, value }, index) => {
                                return (
                                    <ListAvatarTile
                                        key={label + value + index}
                                        name={[label, value]}
                                        ending={
                                            <IconButton
                                                aria-label="remove selected user"
                                                variant="ghost"
                                                icon={<TiCancel />}
                                                onClick={() =>
                                                    setSelectedItems(
                                                        selectedItems.filter(
                                                            (item) => item.label != label,
                                                        ),
                                                    )
                                                }
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
                            <Button disabled>Invite all</Button>
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default InviteMembersDrawer;
