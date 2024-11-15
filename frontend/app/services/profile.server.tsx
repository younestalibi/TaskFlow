import client from "~/lib/axios.server";
import { currentToken, storage } from "./auth.server";
import ErrorValidation from "~/lib/custom-error";
import { redirect } from "@remix-run/react";

export async function updateProfile({ request, name, email }) {
    const token = await currentToken({ request });

    try {
        await client.put(
            "/profile/update",
            { name, email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { errors: {} }
    } catch (err) {
        const { error, status } = err
        if (status == 422 && error instanceof ErrorValidation) {
            return { errors: error.getErrors() }
        }
        return { errors: { message: "Something went wrong try again later!" } }
    }
}

export async function updatePassword({ request, current_password, new_password, new_password_confirmation }) {
    const token = await currentToken({ request });
    try {
        await client.put(
            "/profile/update-password",
            { current_password, new_password, new_password_confirmation },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { errors: {} }

    } catch (err) {
        const { error, status } = err
        if (status == 422 && error instanceof ErrorValidation) {
            return { errors: error.getErrors() }
        } else if (status == 400) {
            return {
                errors: {
                    message: error
                }
            }
        }
        return { errors: { message: "Something went wrong try again later!" } }
    }
}

export async function deleteUser({ request }) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    const token = await currentToken({ request });

    try {
        await client.delete("/profile/delete", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error) {
        return { errors: { message: "Something went wrong try again later!" } }
    }
    throw redirect("/login", {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    });
}
