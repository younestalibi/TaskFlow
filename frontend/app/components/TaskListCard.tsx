import { Card, Text, Group, ActionIcon, Badge } from '@mantine/core';
import { formatDateToReadable } from '~/lib/format-date';
import { IconEye, IconPencil, IconSend, IconTrash } from '@tabler/icons-react';
import { Link } from '@remix-run/react';

export default function TaskListCard({ taskList, onDelete, onEdit, onSahre }) {

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
                <Text fw={500} size="lg">{taskList?.title}</Text>
                <Group>
                    <ActionIcon color="blue" onClick={() => { onEdit(taskList) }} className='hover:cursor-pointer'>
                        <IconPencil size={16} />
                    </ActionIcon>
                    <ActionIcon color="red" onClick={() => { onDelete(taskList.id) }} className='hover:cursor-pointer'>
                        <IconTrash size={16} />
                    </ActionIcon>
                    <Link to={`/dashboard/tasklists/${taskList?.id}`}>
                        <ActionIcon color="green">
                            <IconEye size={16} />
                        </ActionIcon>
                    </Link>
                </Group>
            </Group>
            <Text truncate={'end'} size="sm" c="dimmed" mt="xs">{taskList?.description}</Text>
            <Group justify='space-between'>
                <Badge color="gray" mt="md">
                    {formatDateToReadable(taskList?.created_at)}
                </Badge>
                <ActionIcon color={'blue'} onClick={() => { onSahre(taskList) }} className='hover:cursor-pointer'>
                    <IconSend size={16} />
                </ActionIcon>
            </Group>
        </Card>
    )
}