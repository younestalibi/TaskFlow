import { useLoaderData } from "@remix-run/react";
import { Navbar } from "~/components/HeaderNavbar";
import { Faq } from "~/components/home/Faq";
import { Features } from "~/components/home/Features";
import { Footer } from "~/components/home/Footer";
import Hero from "~/components/home/Hero";
import { getUser } from "~/services/auth.server";

export async function loader({ request }) {
  const user = await getUser({ request })
  return user
}
export default function Index() {
  const user = useLoaderData();
  return (
    <>
    <div>last time </div>
      <Navbar user={user} />
      <Hero />
      <Features />
      <Faq />
      <Footer />
    </ >
  );
}
