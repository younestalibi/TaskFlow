import { Button, Divider, Grid, Group, Input, Loader, Modal, MultiSelect, Select, Space, Table, Text, Textarea, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import TaskListCard from '~/components/TaskListCard';
import { createTaskList, deleteTaskList, getTaskLists, shareTaskList, updateTaskList } from '~/services/taskList.server';


export const loader = async ({ request }) => {
    const response = await getTaskLists({ request });
    return response;
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const type = formData.get("type");
    if (type === 'delete_tasklist') {
        const taskListId = formData.get('taskListId');
        const response = await deleteTaskList({ request, taskListId });
        return response
    } else if (type === 'create_tasklist') {
        const title = formData.get("title");
        const description = formData.get("description");
        const response = await createTaskList({ request, title, description })
        return response;
    } else if (type === 'update_tasklist') {
        const title = formData.get("title");
        const description = formData.get("description");
        const taskListId = formData.get("taskListId");
        const response = await updateTaskList({ request, taskListId, title, description })
        return response;
    } else if (type === 'share_tasklist') {
        const taskListId = formData.get("taskListId");
        const users = formData.get("users");
        const response = await shareTaskList({ request, taskListId, users })
        return response;
    }
    return { errors: null, data: null }
};

export default function WorkSpace() {
    const fetcher = useFetcher();
    const taskLists = useLoaderData()
    const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);
    const [shareOpened, { open: shareOpen, close: shareClose }] = useDisclosure(false);
    const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [deleteId, setDeleteId] = useState(0)
    const [selectedTaskList, setSelectedTaskList] = useState(null)
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState<
        { id: number; name: string; permission: string }[]
    >([]);

    const response = fetcher.data
    const isSubmitting = fetcher.state == 'submitting'
    const isSearching = fetcher.state == 'loading'
    const titleError = response?.errors?.title || null;
    const descriptionError = response?.errors?.description || null;

    useEffect(() => {
        if (response?.data) {
            if (opened) close();
            if (deleteOpened) deleteClose();
            if (editOpened) editClose();
            if (shareOpened) {
                shareClose();
                setSelectedUsers([])
            };
        }
    }, [response, close, deleteClose, editClose, shareClose]);


    const handleDeleteTaskList = (taskListId: int) => {
        setDeleteId(taskListId)
        deleteOpen()
    };
    const handleEditTaskList = (taskList) => {
        setSelectedTaskList(taskList);
        editOpen()
    };
    const handleShareTaskList = (taskListId: int) => {
        setSelectedTaskList(taskListId);
        shareOpen()
    };



    // Fetch autocomplete suggestions
    useEffect(() => {
        if (query.trim() !== "") {
            fetcher.load(`/dashboard/test?query=${query}`);
        }
    }, [query]);

    useEffect(() => {
        if (fetcher.data?.users) {
            setSuggestions(fetcher.data.users.map((user: { id: number; name: string }) => ({
                value: user.id.toString(),
                label: user.name,
            })));
        }
    }, [fetcher.data]);


    // Handle MultiSelect change
    const handleUserSelect = (selected: string[]) => {
        const newUsers = selected
            .map((id) => {
                const user = suggestions.find((suggestion) => suggestion.value === id);
                return user ? { id: parseInt(id), name: user.label, permission: "view" } : null;
            })
            .filter(Boolean) as { id: number; name: string; permission: string }[];

        const mergedUsers = [...selectedUsers];
        newUsers.forEach((newUser) => {
            if (!mergedUsers.find((user) => user.id === newUser.id)) {
                mergedUsers.push(newUser);
            }
        });
        setSelectedUsers(mergedUsers);
    };

    // Handle permission change
    const handlePermissionChange = (userId: number, permission: string) => {
        setSelectedUsers((prev) =>
            prev.map((user) =>
                user.id === userId ? { ...user, permission } : user
            )
        );
    };

    // Handle form submission
    const handleSubmit = async () => {
        const users = selectedUsers.map(({ id, permission }) => ({ id, permission }))
        console.log(users)

        fetcher.submit(
            { taskListId: selectedTaskList?.id, users: JSON.stringify(users), type: "share_tasklist" },
            { method: "POST" }
        );
    };



    return (
        <>

            <Group justify='space-between' align='center'>
                <Title order={2} mb="md">YOUR WORKSPACES</Title>
                <Button onClick={open}>Add new TaskList</Button>
            </Group>

            <Space h="md" />
            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
                {taskLists?.length ?
                    taskLists.map((taskList, key) => (
                        <Grid.Col key={key} span={{ base: 12, md: 6, lg: 3 }}>
                            <TaskListCard taskList={taskList} onDelete={handleDeleteTaskList} onEdit={handleEditTaskList} onSahre={handleShareTaskList} />
                        </Grid.Col>
                    ))
                    :
                    <Grid.Col span={12} >
                    <Text size="lg" c="dimmed">
                        No task lists created yet.
                    </Text>
                </Grid.Col>
                }

            </Grid>
            <Space h="xl" />

            <Modal opened={opened} onClose={close} title="Create New Task-List" centered>
                <fetcher.Form method="POST">
                    <Input type="hidden" name="type" value="create_tasklist" />
                    <TextInput error={titleError} withAsterisk name="title" label="name" placeholder="your name" />
                    <Textarea
                        error={descriptionError}
                        label="Description"
                        name='description'
                        withAsterisk
                        description="description"
                        placeholder="The description"
                    />
                    <Button loading={isSubmitting} type="submit" fullWidth mt="xl">
                        Create
                    </Button>
                </fetcher.Form>
            </Modal>
            <Modal opened={deleteOpened} onClose={deleteClose} title="Are you sure?" centered>
                <Text>Are you sure you want to delete this task? This action cannot be undone.</Text>
                <fetcher.Form method="DELETE">
                    <Input type="hidden" name="type" value="delete_tasklist" />
                    <Input type='hidden' name='taskListId' value={deleteId} />
                    <Group mt="lg" justify="flex-end">
                        <Button loading={isSubmitting} type='submit' color="red" fullWidth mt="xl" >Delete</Button>
                        <Button variant="outline" fullWidth mt="xs" onClick={deleteClose}>Cancel</Button>
                    </Group>
                </fetcher.Form>
            </Modal>
            <Modal opened={editOpened} onClose={editClose} title="Edit New Task-List" centered>
                <fetcher.Form method="PUT">
                    <Input type='hidden' name="taskListId" value={selectedTaskList?.id} />
                    <Input type="hidden" name="type" value="update_tasklist" />
                    <TextInput error={titleError} withAsterisk name="title" label="name" placeholder="your name" defaultValue={selectedTaskList?.title} />
                    <Textarea
                        error={descriptionError}
                        defaultValue={selectedTaskList?.description}
                        label="Description"
                        name='description'
                        withAsterisk
                        description="description"
                        placeholder="The description"
                    />
                    <Button loading={isSubmitting} type="submit" fullWidth mt="xl">
                        Update
                    </Button>
                </fetcher.Form>
            </Modal>
            <Modal opened={shareOpened} onClose={shareClose} title="Share Task-List" centered>
                <MultiSelect
                    data={suggestions}
                    placeholder="Search and select users"
                    value={selectedUsers.map((user) => user.id.toString())}
                    onChange={handleUserSelect}
                    searchable
                    onSearchChange={setQuery}
                    onRemove={(id) => {
                        setSelectedUsers((prev) =>
                            prev.filter((u) => u.id.toString() !== id)
                        )
                    }}
                    nothingFoundMessage={
                        isSearching ? <Loader size={20} /> : <div>nothing was found</div>
                    }

                />
                <Space h={'md'} />
                {selectedUsers.length > 0 && (
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Permission</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {selectedUsers.map((user) => (
                                <Table.Tr key={user.id}>
                                    <Table.Td>{user.name}</Table.Td>
                                    <Table.Td>
                                        <Select
                                            data={[
                                                { value: "view", label: "View" },
                                                { value: "edit", label: "Edit" },
                                            ]}
                                            value={user.permission}
                                            onChange={(value) =>
                                                handlePermissionChange(user.id, value || "view")
                                            }
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <Button
                                            color="red"
                                            onClick={() =>
                                                setSelectedUsers((prev) =>
                                                    prev.filter((u) => u.id !== user.id)
                                                )
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}

                <Space h={'md'} />

                <Button
                    loading={isSubmitting}
                    onClick={handleSubmit}
                    disabled={selectedUsers.length === 0}>
                    Share Tasklist
                </Button>
            </Modal>

        </>
    );
}