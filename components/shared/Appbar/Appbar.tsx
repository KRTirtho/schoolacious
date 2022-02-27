import React, { FC } from 'react';
import {
  IconButton,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
  useTheme,
  theme as base,
} from '@chakra-ui/react';
import { IoIosSunny, IoIosMoon, IoIosLogOut } from 'react-icons/io';
import { RiUser3Line } from 'react-icons/ri';
import { FaSchool, FaUserAlt } from 'react-icons/fa';
import useLoggedIn from 'hooks/useLoggedIn';
import { BsGear } from 'react-icons/bs';
// import NotificationPopover from 'components/shared/NotificationPopover/NotificationPopover';
import { useRouter } from 'next/router';
import { titumir } from 'services/titumir';
import Link from 'next/link';
import { useUserMeta } from 'services/titumir-hooks/useUserMeta';

const Appbar: FC = () => {
  const router = useRouter();

  const { data: userMeta } = useUserMeta();
  const { toggleColorMode } = useColorMode();

  const theme = useTheme<typeof base>();

  const SchemeToggleIcon = useColorModeValue(IoIosMoon, IoIosSunny);
  const bg = useColorModeValue(theme.colors.gray[50], theme.colors.gray[700]);
  const colorMode = useColorModeValue('Dark', 'Light');

  const loggedIn = useLoggedIn(false);

  const onClickLogout = () => {
    titumir.supabase.auth.signOut();
    router.push('/');
  };

  if (!loggedIn) return <></>;

  return (
    <Flex
      bg={bg}
      mb="3"
      direction="row"
      justify="space-between"
      align="center"
      pos="sticky"
      as="nav"
      p="1"
      zIndex="1"
    >
      <Link href="/" passHref>
        <Heading cursor="pointer" size="md">
          Schoolacious
        </Heading>
      </Link>
      {/* Action Button */}
      <Flex>
        {/* <NotificationPopover /> */}

        <Menu isLazy>
          <MenuButton as={IconButton} icon={<RiUser3Line />} variant="ghost" />
          <MenuList>
            <MenuItem
              closeOnSelect={false}
              icon={<SchemeToggleIcon />}
              onClick={toggleColorMode}
            >
              {colorMode}
            </MenuItem>
            {userMeta?.school && (
              <Link href="/school" passHref>
                <MenuItem icon={<FaSchool />}>Your School</MenuItem>
              </Link>
            )}
            <Link href="/user/profile" passHref>
              <MenuItem icon={<FaUserAlt />}>Profile</MenuItem>
            </Link>
            <Link href="/user/configure/invitations" passHref>
              <MenuItem icon={<BsGear />}>Settings</MenuItem>
            </Link>
            <MenuItem onClick={onClickLogout} icon={<IoIosLogOut />}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Appbar;
