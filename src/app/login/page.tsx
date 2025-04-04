import LoginForm from "@/components/LoginForm";
import { getUserSession } from "@/lib/actions";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login Page",
  description: "Generated by create next app",
};
const Page = async () => {
  // console.log((await cookies()).get("user")?.value);
  const user = await getUserSession();
  if (user) return redirect("/");
  return (
    <main>
      <LoginForm />
    </main>
  );
};

export default Page;
