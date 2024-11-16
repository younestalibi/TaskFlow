import client from "~/lib/axios.server";
import ErrorValidation from "~/lib/custom-error";
import { currentToken } from "./auth.server";

export async function updateTaskStatus({ request, taskId, status }) {
    const token = await currentToken({ request });
    try {
        const response = await client.put(
            `/tasks/${taskId}/update-status`,
            { status },
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