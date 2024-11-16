import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
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
    Alert,
} from '@mantine/core';
import classes from '../styles/AuthenticationTitle.module.css';

export const loader = async ({ request }) => {
    await requireGuest({ request });
    return null;
};

export const action = async ({ request }) => {
    await requireGuest({ request });

    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    const { errors, redirector, message } = await login({ request, email, password });

    return errors || redirector || message;
};


export default function LoginPage() {
    const response = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting"

    const generalError = response?.message || null;
    const emailError = response?.email || null;
    const passwordError = response?.password || null;
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
                    {generalError && (
                        <Alert color="red" mb="sm">
                            <div className="text-red-500">{generalError}</div>
                        </Alert>
                    )}
                    <Form method="POST">
                        <TextInput
                            error={emailError}
                            name="email" label="Email" placeholder="you@mantine.dev" />
                        <PasswordInput
                            error={passwordError}
                            name="password" label="Password" placeholder="Your password" mt="md" />
                        {/* <Group justify="space-between" mt="lg">
                            <Checkbox label="Remember me" />
                            <Link to={'/forgotpassword'}>
                                <Anchor component="button" size="sm">
                                    Forgot password?
                                </Anchor>
                            </Link>
                        </Group> */}
                        <Button loading={isSubmitting} type="submit" fullWidth mt="xl">
                            Sign in
                        </Button>
                    </Form>
                </Paper>
            </Container>
        </>
    );
}