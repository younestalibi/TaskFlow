import { Button, Divider, Grid, Modal, Space, Textarea, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import TaskListCard from '~/components/TaskListCard/TaskListCard';
import { createTaskList, getTaskLists } from '~/services/taskList.server';


export const loader = async ({ request }) => {
    const response = await getTaskLists({ request });
    return response;
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const { errors } = await createTaskList({ request, title, description })
    return errors;
};

export default function WorkSpace() {
    const fetcher = useFetcher();
    const taskLists = useLoaderData()

    const response = fetcher.data
    console.log(response)
    const isSubmitting = fetcher.state == 'submitting'
    const [opened, { open, close }] = useDisclosure(false);

    const titleError = response?.title || null;
    const descriptionError = response?.description || null;

    useEffect(() => {
        if (response && !titleError && !descriptionError) {
            close();
        }
    }, [response, titleError, descriptionError, close]);

    return (
        <>
            <Title order={2} mb="md">YOUR WORKSPACES</Title>
            <Button onClick={open}>Add new TaskList</Button>

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

            <Modal opened={opened} onClose={close} title="Authentication" centered>
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


        </>
    );
}