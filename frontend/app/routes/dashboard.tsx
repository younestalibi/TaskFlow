import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser, requireAuth } from "~/services/auth.server";

export const loader = async ({ request }) => {
    await requireAuth({ request });
    const user = await getUser({ request })
    return user
};


export default function Dashboard() {
    const user = useLoaderData();

    return (
        <div>
            <h2>layout Page welcome {user?.name}</h2>
            <Outlet context={{ user }} />
        </div>
    );
}
