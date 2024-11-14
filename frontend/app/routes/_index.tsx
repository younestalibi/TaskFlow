import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LoginLinks from "~/components/LoginLinks";
// import LoginLinks from "~/components/LoginLinks";
import { getUser } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export async function loader({ request }) {
  const user = await getUser({ request })
  return user
}
export default function Index() {
  const user = useLoaderData();
  console.log(user)
  return (
    <>
      <div >
        <LoginLinks user={user} />

      </div>
    </>
  );
}
