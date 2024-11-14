import { createCookieSessionStorage, redirect } from "@remix-run/node";
import client from "../lib/axios.server";

const storage = createCookieSessionStorage({
    cookie: {
        name: "ergodnc_session",
        secure: process.env.NODE_ENV === "production", // make sure to set this correctly in production
        secrets: ['secretpass'], // Use a strong secret
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
    },
});

export async function register({ request, name, email, password, password_confirmation }) {
    const session = await storage.getSession(request.headers.get('Cookie'));
    let response;
    try {
        response = await client.post("/register", { name, email, password, password_confirmation });
        session.set("userToken", response?.data.token);
    } catch (error) {
        return { errors: Object.values(error?.data?.error).flat() }
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
    let response;
    try {
        response = await client.post("/login", { email, password });
        session.set("userToken", response?.data.token);
    } catch (error) {
        return { errors: Object.values(error?.data?.error).flat() }
    }


    return {
        redirector: redirect("/", {
            headers: {
                "Set-Cookie": await storage.commitSession(session),
            },
        })
    };
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
    let response;
    const token = await currentToken({ request });
    if (token) {
        try {
            response = await client.get('/me', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.log("User fetch error:", error);
            return null;
        }

        return response.data.user;
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