import { Divider, Grid, Loader, Space, Text, Title } from '@mantine/core';
import { useLoaderData } from '@remix-run/react';
import TaskListCard from '~/components/TaskListCard';
import { getSharedTaskLists } from '~/services/taskList.server';


export const loader = async ({ request }) => {
    const response = await getSharedTaskLists({ request });
    return response;
};

export default function TaskManger() {
    const taskLists = useLoaderData()

    return (
        <>

            <Title order={2} mb="md">TASK-LISTS SHARED WITH YOU</Title>
            <Space h="md" />

            <Space h="md" />
            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
                {taskLists?.length ?
                    taskLists.map((taskList, key) => (
                        <Grid.Col key={key} span={{ base: 12, md: 6, lg: 3 }}>
                            <TaskListCard taskList={taskList} />
                        </Grid.Col>
                    ))
                    :
                     <Grid.Col span={12}>
                        <Text size="lg" c="dimmed">
                            No task lists shared with you yet.
                        </Text>
                    </Grid.Col>
                }
            </Grid>
            <Space h="xl" />
        </>
    );
}