import { Card, Image, Text, Group, ActionIcon, Badge } from '@mantine/core';
import classes from './TaskListCard.module.css';
import { formatDateToReadable } from '~/lib/format-date';
import { IconEdit, IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import { Link } from '@remix-run/react';

export default function TaskListCard({ taskList, onDelete, onEdit }) {

    const handleDelete = () => {
        onDelete(taskList.id);
    };
    const handleEdit = () => {
        onEdit(taskList.id);
    };
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
                <Text fw={500} size="lg">{taskList?.title}</Text>
                <Group>
                    <ActionIcon color="blue" onClick={handleEdit} className='hover:cursor-pointer'>
                        <IconPencil size={16} />
                    </ActionIcon>
                    <ActionIcon color="red" onClick={handleDelete} className='hover:cursor-pointer'>
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
            <Badge color="gray" mt="md">
                {formatDateToReadable(taskList?.created_at)}
            </Badge>
        </Card>
    )
}