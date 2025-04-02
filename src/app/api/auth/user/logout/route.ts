import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
  (await cookies()).delete("user");
  return NextResponse.json({ message: "Success To Logout", status: 200 });
};
