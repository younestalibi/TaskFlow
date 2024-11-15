
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, AppShell, Box, Button, Container, Group } from '@mantine/core';
import { Link, Outlet } from '@remix-run/react';
import { AppLogo } from './AppLogo';
// import { RecruitHubLogo } from '../components/shared/logo/logo';
// import { IconCaretLeft, IconCaretRight } from '@tabler/icons-react';
// import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
// import { axiosInstance } from '../utils';
// import { useAuthStore } from '../store';
// import { useEffect } from 'react';
// import UserToolbar from '../components/shared/user-toolbar';
// import { queryClient } from '../App';
// import { useRouterState } from '@tanstack/react-router';

// export const useCurrentUser = () => {
//     const { setUser, logout, isLoggedIn, user } = useAuthStore();
//     const navigate = useNavigate();
//     const state = useRouterState();
//     const userQuery = useSuspenseQuery(currentUserQueryOptions);

//     useEffect(() => {
//         if (!userQuery.isFetching) {
//             if (userQuery.isFetched && userQuery.data) {
//                 setUser(userQuery.data);
//             } else if (state.location.pathname === '/portal') {
//                 navigate({
//                     to: '/login'
//                 });
//             }
//         }
//     }, []);

//     return {
//         isLoggedIn,
//         user,
//         logout,
//         userQuery
//     };
// };

// const fetchUser = async () => {
//     try {
//         const response = await axiosInstance.get('/user');
//         if (response.status === 401) {
//             return null;
//         }
//         return response.data;
//     } catch (error) {
//         return null;
//     }
// };

// export const currentUserQueryOptions = queryOptions({
//     queryKey: ['authenticated-user'],
//     queryFn: fetchUser
// });

export function PortalLayout({ user }) {
    const [opened, { toggle }] = useDisclosure();
    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: opened } }}
            padding='md'
        >
            <AppShell.Header>
                <Group h='100%' px='md' mx='xl' justify='space-between'>
                    <Link to='/'>
                        <AppLogo width={150} />
                    </Link>
                    <Group>
                        {user ? (
                            <>
                                <Group visibleFrom="sm">
                                    Welcome <b className=" text-sm text-gray-700">
                                        {user.name}
                                    </b>
                                </Group>
                            </>
                        ) : (
                            <Group visibleFrom="sm">
                                <Link to={'/login'}><Button variant="default">Log in</Button></Link>
                                <Link to={'/register'}> <Button>Sign up</Button></Link>
                            </Group>
                        )}
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                <Box
                    p='md'
                    style={{
                        position: 'relative',
                        height: 'inherit'
                    }}
                >
                    <ActionIcon
                        variant='filled'
                        aria-label='Settings'
                        radius='lg'
                        onClick={toggle}
                        styles={{
                            root: {
                                position: 'absolute',
                                top: '50%',
                                right: opened ? '-15px' : '-20px'
                            }
                        }}
                    >
                        {opened ? (
                            <b>open</b>
                            // <IconCaretLeft style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        ) : (
                            <b>closed</b>
                            // <IconCaretRight style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        )}
                    </ActionIcon>
                    {/* <PortalNavbar /> */}
                    portal
                </Box>
            </AppShell.Navbar>
            <AppShell.Main>
                <Container size='lg'>
                    <Outlet />
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}

