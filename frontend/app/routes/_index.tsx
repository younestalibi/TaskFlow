import { useLoaderData } from "@remix-run/react";
import { Navbar } from "~/components/HeaderNavbar";
import { getUser } from "~/services/auth.server";

export async function loader({ request }) {
  const user = await getUser({ request })
  return user
}
export default function Index() {
  const user = useLoaderData();
  return (
    <>
      <Navbar user={user} />
      <div>Welcome page</div>
    </>
  );
}
