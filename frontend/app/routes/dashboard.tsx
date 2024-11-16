import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { getUser, logout, requireAuth } from "~/services/auth.server";
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, AppShell, Box, Button, Container, Group } from '@mantine/core';
import { AppLogo } from "~/components/AppLogo";
import { PortalNavbar } from "~/components/Navbar/PortalNavbar";
import { IconCaretLeft, IconCaretRight } from "@tabler/icons-react";


export const loader = async ({ request }) => {
    await requireAuth({ request });
    const user = await getUser({ request })
    return user
};
export const action = async ({ request }) => {
    await logout({ request });
    return null
};


export default function Dashboard() {
    const user = useLoaderData();
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
                                    <b className=" text-sm text-gray-700">
                                        {user.name}
                                    </b>
                                    <Form method="POST">
                                        <Button type="submit">
                                            Logout
                                        </Button>
                                    </Form>
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
                                width: "50px",
                                height: "50px",
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '50%',
                                right: '-25px'
                            }
                        }}
                    >
                        {opened ? (
                            <IconCaretRight style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        ) : (
                            <IconCaretLeft style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        )}
                    </ActionIcon>

                    <PortalNavbar />


                </Box>
            </AppShell.Navbar>
            <AppShell.Main>
                <Container size='lg'>
                    <Outlet context={{ user }} />
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
