import { Button, Divider, Grid, Group, Input, Modal, Space, Text, Textarea, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useActionData, useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import TaskListCard from '~/components/TaskListCard/TaskListCard';
import { createTaskList, deleteTaskList, getTaskLists, updateTaskList } from '~/services/taskList.server';


export const loader = async ({ request }) => {
    const response = await getTaskLists({ request });
    return response;
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const method = request.method;
    if (method === 'DELETE') {
        const taskListId = formData.get('taskListId');
        const response = await deleteTaskList({ request, taskListId });
        return response
    } else if (method === 'POST') {
        const title = formData.get("title");
        const description = formData.get("description");
        const response = await createTaskList({ request, title, description })
        return response;
    } else if (method === 'PUT') {
        const title = formData.get("title");
        const description = formData.get("description");
        const taskListId = formData.get("taskListId");
        const response = await updateTaskList({ request, taskListId, title, description })
        return response;
    }
    return { errors: null, data: null }
};

export default function WorkSpace() {
    const fetcher = useFetcher();
    const taskLists = useLoaderData()
    const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);
    const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [deleteId, setDeleteId] = useState(0)
    const [selectedTaskList, setSelectedTaskList] = useState(null)



    const response = fetcher.data
    console.log(response)
    const isSubmitting = fetcher.state == 'submitting'

    const titleError = response?.errors?.title || null;
    const descriptionError = response?.errors?.description || null;

    useEffect(() => {
        if (response?.data) {
            if (opened) close();
            if (deleteOpened) {
                setDeleteId(0)
                deleteClose()
            }
            if (editOpened) {
                setSelectedTaskList(null)
                editClose()
            }
        }
    }, [response, close, deleteClose, editClose]);


    const handleDeleteTaskList = (taskListId: string) => {
        setDeleteId(taskListId)
        deleteOpen()
    };
    const handleEditTaskList = (taskListId: string) => {
        const taskList = taskLists?.find((task) => task.id === taskListId);
        if (taskList) {
            setSelectedTaskList(taskList);
            editOpen()
        }
    };
    return (
        <>
            <Title order={2} mb="md">YOUR WORKSPACES</Title>
            <Button onClick={open}>Add new TaskList</Button>

            <Space h="md" />
            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
                {taskLists?.length ?
                    taskLists.map((taskList, key) => (
                        <Grid.Col key={key} span={{ base: 12, md: 6, lg: 3 }}>
                            <TaskListCard taskList={taskList} onDelete={handleDeleteTaskList} onEdit={handleEditTaskList} />
                        </Grid.Col>
                    ))
                    :
                    <b>not found</b>
                }

            </Grid>
            <Space h="xl" />
            <Divider my="lg" />
            <Space h="xl" />
            <Title order={2} mb="md">SHARED WITH YOU</Title>
            <Space h="md" />
            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
                {taskLists?.length ?
                    taskLists.map((taskList, key) => (
                        <Grid.Col key={key} span={{ base: 12, md: 6, lg: 3 }}>
                            <TaskListCard taskList={taskList} />
                        </Grid.Col>
                    ))
                    :
                    <b>not found</b>
                }
            </Grid>
            <Space h="xl" />

            <Modal opened={opened} onClose={close} title="Create New Task-List" centered>
                <fetcher.Form method="POST">
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
                    <Input type='hidden' name='taskListId' value={deleteId} />
                    <Group mt="lg" justify="flex-end">
                        <Button loading={isSubmitting} type='submit' color="red" fullWidth mt="xl" >Delete</Button>
                        <Button variant="outline" fullWidth mt="xs" onClick={deleteClose}>Cancel</Button>
                    </Group>
                </fetcher.Form>
            </Modal>
            <Modal opened={editOpened} onClose={editClose} title="Edit New Task-List" centered>
                <fetcher.Form method="PUT">
                    <TextInput error={titleError} withAsterisk name="title" label="name" placeholder="your name" defaultValue={selectedTaskList?.title} />
                    <Input type='hidden' name="taskListId" value={selectedTaskList?.id} />
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

        </>
    );
}