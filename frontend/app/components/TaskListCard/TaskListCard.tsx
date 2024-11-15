import { Card, Image, Text, Group } from '@mantine/core';
import classes from './TaskListCard.module.css';
import { formatDateToReadable } from '~/lib/format-date';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export default function TaskListCard({ taskList }) {
    

    return (
        <Card withBorder padding="lg" className={classes.card}>
            <Card.Section>
                <Image
                    src="https://images.unsplash.com/photo-1581889470536-467bdbe30cd0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80"
                    alt="Running challenge"
                    height={100}
                />
            </Card.Section>

            <Group justify="space-between" mt="xl">
                <Text fz="sm" fw={700} className={classes.title}>
                    {taskList?.title}
                </Text>
                <Group gap={5}>
                    <Text fz="xs" c="dimmed">
                        {formatDateToReadable(taskList?.created_at)}
                    </Text>
                </Group>
            </Group>
            <Text mt="sm" mb="md" c="dimmed" fz="xs">
                {taskList?.description}
            </Text>
            <Card.Section className={classes.footer}>
                <IconTrash color='red' />
                <IconEdit color='blue' />
            </Card.Section>
        </Card>
    );
}