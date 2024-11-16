import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Group, Input, Modal, Space, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { getTaskListById } from "~/services/taskList.server";
import { createTask, deleteTaskById, updateTaskById, updateTaskStatus } from "~/services/task.server";
import { useDisclosure } from "@mantine/hooks";

export const loader = async ({ params, request }) => {
    const taskListId = params.tasklistId;
    const response = await getTaskListById({ request, taskListId })
    return response
};
export const action = async ({ request }) => {
    const formData = await request.formData();
    const type = formData.get('type');
    if (type === "update_task_status") {
        const taskId = formData.get('taskId');
        const status = formData.get('status');
        const response = await updateTaskStatus({ request, taskId, status })
        return response
    } else if (type === "delete_task") {
        const taskId = formData.get('taskId');
        const response = await deleteTaskById({ request, taskId })
        return response;
    } else if (type === "create_task") {
        const task_list_id = formData.get('task_list_id');
        const title = formData.get('title');
        const description = formData.get('description');
        const response = await createTask({ request, task_list_id, title, description })
        return response;
    } else if (type === "edit_task") {
        const taskId = formData.get('taskId');
        const title = formData.get('title');
        const description = formData.get('description');
        const response = await updateTaskById({ request, taskId, title, description })
        return response;
    }
    return null
};

// Main Component
const DragDrop = () => {
    const fetcher = useFetcher();
    const response = useLoaderData();

    // Modal states
    const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);

    // Task management states
    const [deleteId, setDeleteId] = useState(0);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });

    const isSubmitting = fetcher.state === "submitting";
    const titleError = fetcher?.data?.errors?.title || null;
    const descriptionError = fetcher?.data?.errors?.description || null;

    const taskList = response?.data;

    // Load tasks into appropriate columns
    useEffect(() => {
        if (taskList?.tasks) {
            setTasks({
                todo: taskList.tasks.filter((task) => task.status === "todo"),
                doing: taskList.tasks.filter((task) => task.status === "doing"),
                done: taskList.tasks.filter((task) => task.status === "done"),
            });
        }
    }, [taskList]);

    // Handle drag and drop logic
    const onDragEnd = ({ source, destination }) => {
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        const sourceTasks = Array.from(tasks[source.droppableId]);
        const destinationTasks = Array.from(tasks[destination.droppableId]);
        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (source.droppableId !== destination.droppableId) {
            destinationTasks.splice(destination.index, 0, movedTask);
        } else {
            sourceTasks.splice(destination.index, 0, movedTask);
        }

        const updatedTasks = {
            ...tasks,
            [source.droppableId]: sourceTasks,
            [destination.droppableId]: destinationTasks,
        };

        setTasks(updatedTasks);

        fetcher.submit(
            { taskId: movedTask.id, status: destination.droppableId, type: "update_task_status" },
            { method: "PUT" }
        );
    };

    // Task modals handlers
    const handleDeleteTask = (taskId) => {
        setDeleteId(taskId);
        openDelete();
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        openEdit();
    };

    useEffect(() => {
        if (fetcher?.data?.data) {
            if (deleteOpened) closeDelete();
            if (editOpened) closeEdit();
            if (createOpened) closeCreate();
        }
    }, [fetcher?.data, closeDelete, closeEdit, closeCreate]);

    return (
        <>
            <Group justify="space-between" align="center">
                <Title order={1} tt="capitalize">{taskList?.title}</Title>
                <Button onClick={openCreate}>Add New Task</Button>
            </Group>

            <Space h="md" />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col lg:flex-row lg:space-x-4">
                    {["todo", "doing", "done"].map((column) => (
                        <Droppable key={column} droppableId={column}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="w-full lg:w-1/3 p-4 bg-gray-100 rounded"
                                >
                                    <Title order={3} tt="capitalize">{column}</Title>
                                    <Space h="sm" />

                                    {tasks[column]?.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided) => (
                                                <Card
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="mb-4"
                                                    shadow="sm"
                                                    padding="lg"
                                                    radius="md"
                                                    withBorder
                                                >
                                                    <Group justify="space-between" mb="xs">
                                                        <Text fw={500}>{task.title}</Text>
                                                        <Badge color="blue">Priority</Badge>
                                                    </Group>
                                                    <Text size="sm" color="dimmed">{task.description}</Text>
                                                    <Group mt="md">
                                                        <Button size="xs" variant="light" onClick={() => handleEditTask(task)}>
                                                            Edit
                                                        </Button>
                                                        <Button size="xs" color="red" variant="light" onClick={() => handleDeleteTask(task.id)}>
                                                            Delete
                                                        </Button>
                                                    </Group>
                                                </Card>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {/* Modals */}
            <Modal opened={createOpened} onClose={closeCreate} title="Create New Task">
                <fetcher.Form method="POST">
                    <Input type="hidden" name="type" value="create_task" />
                    <Input type="hidden" name="task_list_id" value={taskList?.id} />
                    <TextInput label="Title" name="title" error={titleError} />
                    <Textarea label="Description" name="description" error={descriptionError} />
                    <Group justify="flex-end" mt="lg">
                        <Button type="submit" loading={isSubmitting} >Create</Button>
                        <Button variant="outline" onClick={closeCreate}>Cancel</Button>
                    </Group>
                </fetcher.Form>
            </Modal>

            <Modal opened={editOpened} onClose={closeEdit} title="Edit Task">
                <fetcher.Form method="PUT">
                    <Input type="hidden" name="type" value="edit_task" />
                    <Input type="hidden" name="taskId" value={selectedTask?.id} />
                    <TextInput label="Title" name="title" defaultValue={selectedTask?.title} error={titleError} />
                    <Textarea label="Description" name="description" defaultValue={selectedTask?.description} error={descriptionError} />
                    <Group justify="flex-end" mt="lg">
                        <Button type="submit" loading={isSubmitting}>Update</Button>
                        <Button variant="outline" onClick={closeEdit}>Cancel</Button>
                    </Group>
                </fetcher.Form>
            </Modal>

            <Modal opened={deleteOpened} onClose={closeDelete} title="Confirm Delete">
                <Text>Are you sure you want to delete this task? This action cannot be undone.</Text>
                <fetcher.Form method="DELETE">
                    <Input type="hidden" name="type" value="delete_task" />
                    <Input type="hidden" name="taskId" value={deleteId} />
                    <Group justify="flex-end" mt="lg">
                        <Button color="red" type="submit" loading={isSubmitting}>Delete</Button>
                        <Button variant="outline" onClick={closeDelete}>Cancel</Button>
                    </Group>
                </fetcher.Form>
            </Modal>
        </>
    );
};

export default DragDrop;