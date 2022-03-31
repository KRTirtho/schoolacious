import {
  Button,
  List,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpoint,
  ListItemProps,
  useColorModeValue,
  ListItem,
  Stack,
} from '@chakra-ui/react';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import useMounted from 'hooks/useMounted';

export const Sidebar: FC = ({ children }) => {
  const links = useMemo(
    () => [
      { to: `/school/configure/co-admins`, title: 'Co-admins' },
      { to: `/school/configure/add-remove-members`, title: 'Members' },
      {
        to: `/school/configure/grade-section`,
        title: 'Grades & Sections',
      },
      { to: `/school/configure/subjects`, title: 'Subjects' },
      { to: `/school/configure/invitations`, title: 'Invitations' },
      { to: `/school/configure/join-requests`, title: 'Join Requests' },
    ],
    []
  );
  const mounted = useMounted();
  const router = useRouter();

  const [selectedRoute, setSelectedRoute] = useState<string | ReactElement>('');

  const screen = useBreakpoint();

  useEffect(() => {
    const currentRoute = links.find((link) =>
      router.pathname.endsWith(link.to)
    );
    if (currentRoute) setSelectedRoute(currentRoute.title);
  }, [router.pathname, links]);

  const isLargeScreen = useMemo(
    () => screen && !['md', 'sm', 'base'].includes(screen),
    [screen]
  );

  if (!mounted) return <></>;
  return (
    <Stack flexDir={['column', null, null, 'row']} align="flex-start">
      {isLargeScreen ? (
        <List display="flex" flexDir="column" m="5" borderRadius="md" flex={1}>
          {links.map(({ to, title }, i) => (
            <SidebarItem key={to + i} href={to}>
              {title}
            </SidebarItem>
          ))}
        </List>
      ) : (
        <Menu flip>
          <MenuButton
            ml="3"
            mt="3"
            as={Button}
            colorScheme="gray"
            rightIcon={<FaCaretDown />}
          >
            {'Tab - ' + selectedRoute || 'Tabs'}
          </MenuButton>
          <MenuList>
            {links.map(({ title, to }, i) => (
              <Link href={to} passHref key={to + i}>
                <MenuItem cursor="pointer">{title}</MenuItem>
              </Link>
            ))}
          </MenuList>
        </Menu>
      )}
      <Stack flex={4} w="full" overflowX="auto">
        {children}
      </Stack>
    </Stack>
  );
};

export type SidebarItemProps = ListItemProps & LinkProps;

export const SidebarItem: FC<SidebarItemProps> = ({ children, ...props }) => {
  const router = useRouter();
  const bg = useColorModeValue('gray.50', 'gray.700');
  const borderBottomColor = useColorModeValue('gray.300', 'gray.600');

  const isActive = router.pathname.startsWith(`${props.href}`);

  return (
    <Link {...props} passHref>
      <ListItem
        bg={bg}
        p="3"
        borderRight={isActive ? 'solid 5px' : ''}
        borderColor={isActive ? 'green.500' : ''}
        filter={isActive ? 'brightness(90%)' : ''}
        cursor="pointer"
        _hover={{
          filter: 'brightness(90%)',
        }}
        _active={{
          filter: 'brightness(95%)',
        }}
        _first={{
          borderTopLeftRadius: 'md',
        }}
        _last={{
          borderBottomLeftRadius: 'md',
        }}
        _notLast={{
          borderBottom: '1px solid',
          borderBottomColor,
        }}
        fontWeight="bold"
      >
        {children}
      </ListItem>
    </Link>
  );
};
