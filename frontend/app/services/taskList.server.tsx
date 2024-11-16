import client from "~/lib/axios.server";
import { currentToken } from "./auth.server";
import ErrorValidation from "~/lib/custom-error";

export async function getTaskLists({ request }) {
    const token = await currentToken({ request });
    try {
        const response = await client.get(
            "/tasklists",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (err) {
        return { errors: { message: "Something went wrong try again later!" } }
    }
}

export async function createTaskList({ request, title, description }) {
    const token = await currentToken({ request });
    try {
        const response = await client.post(
            "/tasklists",
            { title, description },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { errors: {}, data: response }
    } catch (err) {
        const { error, status } = err
        if (status == 422 && error instanceof ErrorValidation) {
            return { errors: error.getErrors(), data: null }
        }
        return { errors: { message: "Something went wrong try again later!" }, data: null }
    }
}
export async function updateTaskList({ request, taskListId, title, description }) {
    const token = await currentToken({ request });
    try {
        const response = await client.put(
            `/tasklists/${taskListId}`,
            { title, description },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { errors: {}, data: response }
    } catch (err) {
        const { error, status } = err
        if (status == 422 && error instanceof ErrorValidation) {
            return { errors: error.getErrors(), data: null }
        }
        return { errors: { message: "Something went wrong try again later!" }, data: null }
    }
}
export async function deleteTaskList({ request, taskListId }) {
    const token = await currentToken({ request });
    try {
        const response = await client.delete(
            `/tasklists/${taskListId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { errors: {}, data: response }
    } catch (err) {
        return { errors: { message: "Something went wrong try again later!", data: null } }
    }
}
export async function getTaskListById({ request, taskListId}) {
    const token = await currentToken({ request });
    console.log(taskListId)
    try {
        const response = await client.get(
            `/tasklists/${taskListId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log(response)
        return { errors: {}, data: response }
    } catch (err) {
        const { error, status } = err
        console.log(error)
        if (status == 404) {
            return { errors: error, data: null }
        }
        return { errors: { message: "Something went wrong try again later!" }, data: null }
    }
}