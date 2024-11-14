import { useLoaderData } from "@remix-run/react";
import LoginLinks from "~/components/LoginLinks";
import { getUser } from "~/services/auth.server";

export async function loader({ request }) {
  const user = await getUser({ request })
  return user
}
export default function Index() {
  const user = useLoaderData();
  console.log(user)
  return (
    <>
      <div>hello wrold</div>
    </>
  );
}
