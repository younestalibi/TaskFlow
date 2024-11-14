import { Form, Link, useActionData } from "@remix-run/react";
import LabelErrors from "~/components/Errors";
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
    const name = formData.get("name");
    const password = formData.get("password");
    const email = formData.get("email");
    const password_confirmation = formData.get("password_confirmation");

    const { errors, redirector } = await register({ request, name, email, password, password_confirmation });
    return errors || redirector;
};


export default function RegisterPage() {
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
                    Already have an account yet?{' '}
                    <Link to={'/register'}>
                        <Anchor size="sm" component="button">
                            Sign in to your account
                        </Anchor>
                    </Link>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <LabelErrors className="mb-5" errors={errors || []} />

                    <Form method="POST">
                        <TextInput name="name" label="name" placeholder="your name" required />
                        <TextInput name="email" label="Email" placeholder="email@email.com" required />
                        <PasswordInput name="password" label="Password" placeholder="Your password" required mt="md" />
                        <PasswordInput name="password_confirmation" label="Confirm password" placeholder="Confirm your password" required mt="md" />
                        <Button loading={isSubmitting} type="submit" fullWidth mt="xl">
                            Sign up
                        </Button>
                    </Form>
                </Paper>
            </Container>
        </>
    );
}