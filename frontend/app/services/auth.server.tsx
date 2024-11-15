import { createCookieSessionStorage, redirect } from "@remix-run/node";
import client from "../lib/axios.server";
import ErrorValidation from "~/lib/custom-error";

export const storage = createCookieSessionStorage({
    cookie: {
        name: "TASKFLOW_SESSION",
        secure: process.env.NODE_ENV === "production",
        secrets: ['secretpass'],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

export async function register({ request, name, email, password, password_confirmation }) {
    const session = await storage.getSession(request.headers.get('Cookie'));
    let response;
    try {
        response = await client.post("/register", { name, email, password, password_confirmation });
        session.set("userToken", response?.token);
    } catch (err) {
        const { error, status } = err
        if (status == 422 && error instanceof ErrorValidation) {
            return { errors: error.getErrors() }
        }
        return { errors: { message: "Something went wrong try again later!" } }
    }


    return {
        redirector: redirect("/", {
            headers: {
                "Set-Cookie": await storage.commitSession(session),
            },
        })
    };
}
export async function login({ request, email, password }) {
    const session = await storage.getSession(request.headers.get('Cookie'));
    try {
        const response = await client.post("/login", { email, password });
        session.set("userToken", response?.token);
        return {
            redirector: redirect("/", {
                headers: {
                    "Set-Cookie": await storage.commitSession(session),
                },
            })
        };
    } catch (err) {
        const { error, status } = err
        if (status == 422 && error instanceof ErrorValidation) {
            return { errors: error.getErrors() }
        } else if (status == 401) {
            return {
                errors: {
                    message: error
                }
            }
        }
        return { errors: { message: "Something went wrong try again later!" } }
    }
}

export async function logout({ request }) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    const token = session.get("userToken");

    if (token) {
        await client.post("/logout", {}, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
    }

    return redirect("/login", {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    });
}
export async function currentToken({ request }) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    return session.get("userToken");
}

export async function getUser({ request }) {
    const token = await currentToken({ request });
    if (token) {
        try {
            const response = await client.get('/me', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            return response?.user;
        } catch (err) {
            const {status } = err
            if (status == 401) {
                const session = await storage.getSession(request.headers.get("Cookie"));
                throw redirect("/login", {
                    headers: {
                        "Set-Cookie": await storage.destroySession(session),
                    },
                });
            } 
            return null;
        }
    }
    return null;
}
export async function requireGuest({ request }) {
    if (await getUser({ request })) {
        throw redirect("/");
    }
};

export async function requireAuth({ request }) {
    const token = await currentToken({ request });
    if (!token) {
        throw redirect("/login");
    }
}
