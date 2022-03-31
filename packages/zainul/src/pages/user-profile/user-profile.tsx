import { Avatar, chakra, Flex, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { useAuthStore } from "state/authorization-store";

function UserProfile() {
    const user = useAuthStore((s) => s.user);
    return (
        <Stack>
            <chakra.div
                bgSize="cover"
                bgPos="center"
                bgRepeat="no-repeat"
                bgAttachment="fixed"
                h={["xs", "sm", "md"]}
                bgImg="url(https://www.digitalartsonline.co.uk/cmsdata/features/3793918/landscape-illustration-tips_opener.jpg)"
            />
            <Flex justifyContent="center">
                <chakra.div transform="auto" translateY="-50%">
                    <Avatar
                        src={`https://avatars.dicebear.com/api/micah/male/${user?._id}.svg`}
                        size="2xl"
                    />
                    <Heading mt="3" size="md" textAlign="center">
                        {`${user?.first_name} ${user?.last_name}`}
                    </Heading>
                </chakra.div>
            </Flex>
        </Stack>
    );
}

export default UserProfile;
