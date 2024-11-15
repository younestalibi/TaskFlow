import { Button, TextInput, PasswordInput, Card, Group, Title, Input, Modal, Alert } from "@mantine/core";
import { Form, useActionData, useNavigation, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import { requireAuth } from "~/services/auth.server";
import { deleteUser, updatePassword, updateProfile } from "~/services/profile.server";

export const action = async ({ request }) => {
    await requireAuth({ request })
    const formData = await request.formData();
    const actionType = formData.get("type");
    if (actionType == "update_profile") {
        const name = formData.get("name");
        const email = formData.get("email");
        const { errors } = await updateProfile({ request, name, email });
        return errors
    }
    else if (actionType == "update_password") {
        const current_password = formData.get("current_password");
        const new_password = formData.get("new_password");
        const new_password_confirmation = formData.get("new_password_confirmation");
        const { errors } = await updatePassword({ request, current_password, new_password, new_password_confirmation })
        return errors
    } else if (actionType === "delete_account") {
        const { errors } = await deleteUser({ request });
        return errors
    }
    return null

};

export default function Profile() {
    const { user } = useOutletContext();
    const response = useActionData()
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting"
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");

    const generalError = response?.message || null;
    const nameError = response?.name || null;
    const emailError = response?.email || null;
    const currentPasswordError = response?.current_password || null;
    const newPassword = response?.new_password || null;

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    return (
        <>
            <Card shadow="sm" padding="lg" mb="lg">
                <Title order={2} mb="md">Profile Information</Title>
                {generalError && (
                    <Alert color="red" mb="sm">
                        <div className="text-red-500">{generalError}</div>
                    </Alert>
                )}
                <Form method="PUT">
                    <Input type="hidden" name="type" value={"update_profile"} />
                    <TextInput
                        error={nameError}
                        label="Name"
                        placeholder="Your name"
                        name="name"
                        defaultValue={user?.name}
                        mb="sm"

                    />
                    <TextInput
                        error={emailError}
                        label="Email"
                        placeholder="Your email"
                        defaultValue={user?.email}
                        name="email"
                        mb="sm"
                    />
                    <Group mt="md">
                        <Button loading={isSubmitting} type="submit">Save</Button>
                    </Group>
                </Form>
            </Card>

            <Card shadow="sm" padding="lg" mb="lg">
                {generalError && (
                    <Alert color="red" mb="sm">
                        <div className="text-red-500">{generalError}</div>
                    </Alert>
                )}
                <Form method="PUT">
                    <Title order={2} mb="md">Update Password</Title>
                    <Input type="hidden" name="type" value={"update_password"} />
                    <PasswordInput
                        error={currentPasswordError}
                        name="current_password"
                        label="Current Password"
                        placeholder="Enter current password"
                        mb="sm"
                    />
                    <PasswordInput
                        error={newPassword}
                        name="new_password"
                        label="New Password"
                        placeholder="Enter new password"
                        mb="sm"
                    />
                    <PasswordInput
                        name="new_password_confirmation"
                        label="Confirm New Password"
                        placeholder="Confirm new password"
                        mb="sm"
                    />
                    <Group mt="md">
                        <Button loading={isSubmitting} type="submit">Update Password</Button>
                    </Group>
                </Form>
            </Card>

            <Card shadow="sm" padding="lg" mb="lg">
                <Title order={2} mb="md" className="text-red-600">Delete Account</Title>
                <Group mt="md">
                    <Button color="red" onClick={handleDeleteClick}>Delete Account</Button>
                </Group>
            </Card>

            <Modal
                opened={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Account Deletion"
            >
                <Form method="DELETE">
                    <Input type="hidden" name="type" value="delete_account" />
                    <p>To confirm deletion, please type <b>&ldquo;DELETE&ldquo;</b> in the box below:</p>
                    <TextInput
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        mt="sm"
                        required
                    />
                    <Group mt="md">
                        <Button color="gray" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button
                            color="red"
                            type="submit"
                            loading={isSubmitting}
                            disabled={confirmationText !== "DELETE"}
                        >
                            Confirm Delete
                        </Button>
                    </Group>
                </Form>
            </Modal>
        </>
    );
}
