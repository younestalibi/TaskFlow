import { Card, Text, Badge, Group, Button } from '@mantine/core';

export default function TaskCard({ task }) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify='space-between' mb="xs">
                <Text weight={500}>{task?.title}</Text>
                <Badge color={task?.title != 'high' ? 'red' : 'blue'}>
                    {/* {task.priority} */} priority
                </Badge>
            </Group>
            <Text size="sm" c="dimmed">
                {task?.description}
            </Text>
            <Group mt="md">
                <Button size="xs" variant="light" >
                    Edit
                </Button>
                <Button size="xs" color="red" variant="light" >
                    Delete
                </Button>
            </Group>
        </Card>
    );
};


