import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { Card } from "@mantine/core";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { getTaskListById } from "~/services/taskList.server";
import { updateTaskStatus } from "~/services/task.server";

export const loader = async ({ params, request }) => {
    const taskListId = params.tasklistId;
    const response = await getTaskListById({ request, taskListId })
    return response
};
export const action = async ({ request }) => {
    const formData = await request.formData();
    const method = request.method;
    if (method === "PUT") {
        const taskId = formData.get('taskId');
        const status = formData.get('status');
        const response = await updateTaskStatus({ request, taskId, status })
        return response
    }
    return null
};

const DragDrop = () => {
    const fetcher = useFetcher()
    const response = useLoaderData()
    const dd = useActionData()
    console.log(dd)
    console.log(fetcher?.data)
    const taskList = response?.data
    const errors = response?.error
    console.log(taskList)

    const [tasks, setTasks] = useState({
        todo: [],
        doing: [],
        done: [],
    });

    const onDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
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
            { taskId: movedTask.id, status: destination.droppableId },
            { method: 'PUT' }
        );
    };


    useEffect(() => {
        if (taskList?.tasks) {
            const initialTasks = {
                todo: taskList.tasks.filter((task) => task.status === "todo"),
                doing: taskList.tasks.filter((task) => task.status === "doing"),
                done: taskList.tasks.filter((task) => task.status === "done"),
            };
            setTasks(initialTasks);
        }
    }, [taskList]);


    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col lg:flex-row lg:space-x-4">
                    {["todo", "doing", "done"].map((column) => (
                        <Droppable key={column} droppableId={column}>
                            {(provided) => (
                                <div
                                    className="w-full lg:w-1/3 p-4 mb-4 lg:mb-0 bg-gray-100 rounded"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2 className="text-xl font-bold capitalize">
                                        {column}
                                    </h2>
                                    {tasks[column].map((task, index) => (
                                        (<Draggable
                                            key={task.id.toString()}
                                            draggableId={task.id.toString()}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <Card
                                                    className="mb-4"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                // actions={[
                                                //     <span className="justify-center flex gap-2 items-center">
                                                //         <Tooltip
                                                //             title={
                                                //                 task
                                                //                     ?.technician
                                                //                     ?.name
                                                //             }
                                                //             placement="top"
                                                //         >
                                                //             <span>
                                                //                 <CustomAvatar
                                                //                     user={
                                                //                         task?.technician
                                                //                     }
                                                //                 />
                                                //             </span>
                                                //         </Tooltip>
                                                //     </span>,
                                                //     <span
                                                //         onClick={() => {
                                                //             setViewedRow(
                                                //                 project
                                                //             );
                                                //         }}
                                                //     >
                                                //         {task?.attachment ?
                                                //             <a
                                                //                 href={constructServerURL(task?.attachment)}
                                                //             >
                                                //                 Attachment
                                                //             </a> :
                                                //             <span>No attachment</span>
                                                //         }
                                                //     </span>,
                                                //     <button
                                                //         disabled={
                                                //             !!loadingTasks[
                                                //             task.id
                                                //             ]
                                                //         }
                                                //         onClick={() =>
                                                //             deleteTask(
                                                //                 task
                                                //             )
                                                //         }
                                                //     >
                                                //         {!!loadingTasks[
                                                //             task.id
                                                //         ]
                                                //             ? "Deleting..."
                                                //             : "Delete"}
                                                //     </button>,
                                                //     <span
                                                //         onClick={() =>
                                                //             setTask(task)
                                                //         }
                                                //     >
                                                //         Note
                                                //     </span>,
                                                // ]}
                                                >
                                                    {/* <Spin
                                                            spinning={
                                                                !!loadingTasks[
                                                                task.id
                                                                ]
                                                            }
                                                        > */}
                                                    <b>{task?.title}</b>
                                                    {/* </Spin> */}
                                                </Card>
                                            )}
                                        </Draggable>)
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </>
    )
}
export default DragDrop;