import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { register, requireGuest } from "~/services/auth.server";
import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
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
    const name = formData.get("name");
    const password = formData.get("password");
    const email = formData.get("email");
    const password_confirmation = formData.get("password_confirmation");

    const { errors, redirector } = await register({ request, name, email, password, password_confirmation });
    return errors || redirector;
};


export default function RegisterPage() {
    const response = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting"


    const generalError = response?.message || null;
    const nameError = response?.name || null;
    const emailError = response?.email || null;
    const passwordError = response?.password || null;
    return (
        <>
            <Container size={420} my={40}>

                <Title ta="center" className={classes.title}>
                    Welcome back!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Already have an account yet?{' '}
                    <Link to={'/login'}>
                        <Anchor size="sm" component="button">
                            Sign in to your account
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
                        <TextInput error={nameError} name="name" label="name" placeholder="your name" />
                        <TextInput error={emailError} name="email" label="Email" placeholder="email@email.com" />
                        <PasswordInput error={passwordError} name="password" label="Password" placeholder="Your password" mt="md" />
                        <PasswordInput name="password_confirmation" label="Confirm password" placeholder="Confirm your password" mt="md" />
                        <Button loading={isSubmitting} type="submit" fullWidth mt="xl">
                            Sign up
                        </Button>
                    </Form>
                </Paper>
            </Container>
        </>
    );
}