import { Button, PasswordInput, Card, Group, Title } from "@mantine/core";
import UpdateProfile from "./UpdateProfile";


export default function Profile() {

    return (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
            {/* Profile Information Section */}
            <UpdateProfile/>

            {/* Update Password Section */}
            <Card shadow="sm" padding="lg" mb="lg">
                <Title order={2} mb="md">Update Password</Title>
                <PasswordInput
                    label="Current Password"
                    placeholder="Enter current password"
                    required
                    mb="sm"
                />
                <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    required
                    mb="sm"
                />
                <PasswordInput
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    required
                    mb="sm"
                />
                <Group mt="md">
                    <Button>Update Password</Button>
                </Group>
            </Card>

            {/* Delete Account Section */}
            <Card shadow="sm" padding="lg" mb="lg">
                <Title order={2} mb="md" className="text-red-600" >Delete Account</Title>
                <Group mt="md">
                    <Button color="red">Delete Account</Button>
                </Group>
            </Card>
        </div>
    );
}
