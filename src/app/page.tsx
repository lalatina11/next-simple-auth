import LogoutButton from "@/components/LogoutButton";
import { ModeToggle } from "@/components/ModeToggle";
import { getUserSession } from "@/lib/actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Generated by create next app",
};
const Page = async () => {
  const userSession = await getUserSession();

  if (!userSession) return redirect("/login");

  return (
    <main>
      <h1>Hello {userSession.username}</h1>
      <div className="flex gap-4 items-center">
        <ModeToggle />
        <LogoutButton />
      </div>
    </main>
  );
};

export default Page;
