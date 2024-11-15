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
        return { errors: {}, response }
    } catch (err) {
        const { error, status } = err
        if (status == 422 && error instanceof ErrorValidation) {
            return { errors: error.getErrors() }
        }
        return { errors: { message: "Something went wrong try again later!" } }
    }
}