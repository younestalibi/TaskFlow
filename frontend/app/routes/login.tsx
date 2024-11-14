import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import LabelErrors from "~/components/Errors";
import { login, requireGuest } from "~/services/auth.server";
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import classes from '../styles/AuthenticationTitle.module.css';
import { useTransition } from "react";

export const loader = async ({ request }) => {
    await requireGuest({ request });
    return null;
};

export const action = async ({ request }) => {
    await requireGuest({ request });

    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    const { errors, redirector } = await login({ request, email, password });

    return errors || redirector;
};


export default function LoginPage() {
    const errors = useActionData();
    const transition = useTransition();
    const isSubmitting = transition.state === 'submitting';
    console.log(errors)

    return (
        <>
            <Container size={420} my={40}>

                <Title ta="center" className={classes.title}>
                    Welcome back!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Do not have an account yet?{' '}
                    <Link to={'/register'}>
                        <Anchor size="sm" component="button">
                            Create account
                        </Anchor>
                    </Link>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <LabelErrors className="mb-5" errors={errors || []} />

                    <Form method="POST">
                        <TextInput name="email" label="Email" placeholder="you@mantine.dev" required />
                        <PasswordInput name="password" label="Password" placeholder="Your password" required mt="md" />
                        <Group justify="space-between" mt="lg">
                            <Checkbox label="Remember me" />
                            <Link to={'/forgotpassword'}>
                                <Anchor component="button" size="sm">
                                    Forgot password?
                                </Anchor>
                            </Link>
                        </Group>
                        <Button loading={isSubmitting} type="submit" fullWidth mt="xl">
                            Sign in
                        </Button>
                    </Form>
                </Paper>
            </Container>
        </>
    );
}