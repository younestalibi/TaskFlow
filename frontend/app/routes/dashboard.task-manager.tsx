import { Button, Divider, Grid, Group, Space, Title } from '@mantine/core';
import { useLoaderData } from '@remix-run/react';
import TaskListCard from '~/components/TaskListCard/TaskListCard';
import { getTaskLists } from '~/services/taskList.server';


export const loader = async ({ request }) => {
    const response = await getTaskLists({ request });
    return response;
};

export default function TaskManger() {
    const taskLists = useLoaderData()

    return (
        <>
        
            <Title order={2} mb="md">YOUR WORKSPACES</Title>
            <Space h="md" />
            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
                

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


        </>
    );
}