import { authorizationUrl } from "@/lib/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.redirect(authorizationUrl);
};
