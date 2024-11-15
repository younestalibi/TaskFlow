import { Button, TextInput, PasswordInput, Card, Group, Title } from "@mantine/core";
import { Form, useNavigation, useOutletContext } from "@remix-run/react";
import { updateProfile } from "~/services/profile.server";

export const action = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    setTimeout(() => {
        console.log('hi')
    }, 2000)
    const errors = await updateProfile({ request, name, email });

    return errors;
};



export default function UpdateProfile() {
    const { user } = useOutletContext();
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading"

    return (
        <Card shadow="sm" padding="lg" mb="lg">
            <Title order={2} mb="md">Profile Information</Title>
            <Form method="PUT">
                <TextInput
                    label="Name"
                    placeholder="Your name"
                    name="name"
                    defaultValue={user?.name}
                    required
                    mb="sm"
                />
                <TextInput
                    label="Email"
                    placeholder="Your email"
                    defaultValue={user?.email}
                    name="email"
                    required
                    mb="sm"
                />
                <Group mt="md">
                    <Button loading={isLoading} type="submit">Save</Button>
                </Group>
            </Form>
        </Card>
    )
}

