import React, { useEffect, useMemo, useState } from "react";
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
import { MutationContextKey, QueryContextKey } from "configs/enums";
import {
    InvitationBody,
    Invitations_Joins,
    INVITATION_OR_JOIN_ROLE,
} from "services/api/titumir";
import { UserSchema } from "@veschool/types";
import useTitumirMutation from "hooks/useTitumirMutation";
import { useQueryClient } from "react-query";
import { userToName } from "utils/userToName";
import { capitalize } from "lodash-es";

export interface OptionType extends OptionTypeBase {
    label: React.ReactElement;
    labelStr: string;
    value: string;
}

interface InviteMembersDrawerProps {
    role: INVITATION_OR_JOIN_ROLE;
}

function InviteMembersDrawer({ role }: InviteMembersDrawerProps) {
    const { isOpen, onClose: handleClose, onOpen: handleOpen } = useDisclosure();

    const {
        data: optionsRaw,
        refetch,
        isLoading,
    } = useTitumirQuery<UserSchema[]>(
        QueryContextKey.QUERY_USER,
        (api) => api.queryUser(query).then(({ json }) => json),
        {
            enabled: false,
        },
    );

    const queryClient = useQueryClient();

    const { mutate: invite } = useTitumirMutation<Invitations_Joins[], InvitationBody[]>(
        MutationContextKey.INVITATION,
        (api, invitations) => api.invite(invitations).then(({ json }) => json),
    );

    const [selectedItems, setSelectedItems] = useState<OptionsType<OptionType>>([]);

    const selectedValue = selectedItems.map(({ value }) => value);

    const options: OptionsType<OptionType> = (
        optionsRaw?.map((user) => ({
            value: user._id,
            label: (
                <div>
                    <Text>{userToName(user)}</Text>
                    <Text color="gray.500">{user.email}</Text>
                </div>
            ),
            labelStr: userToName(user),
        })) ?? []
    ).filter(({ value }) => !selectedValue.includes(value));

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

    function inviteAll() {
        invite(
            selectedItems.map(({ value }) => ({
                user_id: value,
                role,
            })),
            {
                onSuccess() {
                    setSelectedItems([]);
                    queryClient
                        .resetQueries(QueryContextKey.QUERY_USER, { exact: true })
                        .then(() => {
                            handleClose();
                        })
                        .catch((e) => console.error(e));
                },
            },
        );
    }

    const character = useMemo(() => capitalize(role.valueOf()), [role]);
    return (
        <>
            <Button
                variant="ghost"
                isFullWidth
                onClick={handleOpen}
                leftIcon={<FiUserPlus />}
            >
                Invite {character}s
            </Button>

            <Drawer placement="right" onClose={handleClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Invite new {character}</DrawerHeader>

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
                                onClick={inviteAll}
                            >
                                Invite all
                            </Button>
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default InviteMembersDrawer;
