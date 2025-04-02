import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
};
