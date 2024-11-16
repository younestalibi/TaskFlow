import {
    Group,
    Button,
    Divider,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '../styles/HeaderMegaMenu.module.css';
import { Link } from '@remix-run/react';
import { AppLogo } from './AppLogo';



export function Navbar({ user }) {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

    return (
        <Box pb={30} pt={10}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <AppLogo width={150} />
                    <Group h="100%" gap={0} visibleFrom="sm">
                        <Link to="/" className={classes.link}>
                            Home
                        </Link>
                        <Link to="/" className={classes.link}>
                            About us
                        </Link>
                    </Group>

                    {user ? (
                        <>
                            <Group visibleFrom="sm">
                                <b className="ml-4 text-sm text-gray-700">
                                    {user.name}
                                </b>
                                <Link
                                    to="/dashboard"
                                    className="ml-4 text-sm text-gray-700 underline"
                                >
                                    <Button>Dashboard</Button>
                                </Link>
                            </Group>
                        </>
                    ) : (
                        <Group visibleFrom="sm">
                            <Link to={'/login'}><Button variant="default">Log in</Button></Link>
                            <Link to={'/register'}> <Button>Sign up</Button></Link>
                        </Group>
                    )}

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Divider my="sm" />

                    <Link to="#" className={classes.link}>
                        Home
                    </Link>



                    <Divider my="sm" />

                    {user ? (
                        <>
                            <Group >
                                <b className="ml-4 text-sm text-gray-700">
                                    {user.name}
                                </b>
                                <Link
                                    to="/dashboard"
                                    className="ml-4 text-sm text-gray-700 underline"
                                >
                                    <Button>Dashboard</Button>
                                </Link>
                            </Group>
                        </>
                    ) : (
                        <Group justify="center" grow pb="xl" px="md">
                            <Link to={'/login'}><Button variant="default">Log in</Button></Link>
                            <Link to={'/register'}> <Button>Sign up</Button></Link>
                        </Group>

                    )}
                </ScrollArea>
            </Drawer>
        </Box>
    );
}