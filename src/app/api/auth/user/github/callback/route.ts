import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");

  if (!code)
    return NextResponse.json({ error: "Code is required" }, { status: 400 });

  try {
    // Exchange code for access token
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) throw new Error("Failed to get access token");

    // Get GitHub user data
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userFromGithub = await userRes.json();

    if (!userFromGithub) throw new Error("Failed to fetch user");

    const { login: username, email } = userFromGithub;

    if (!email || !username) {
      throw new Error("Invalid Credentials!");
    }

    let user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      user = await prisma.user.create({ data: { email, username } });
    }

    const { id: userIdFromDB } = user;

    // Generate JWT token
    const token = jwt.sign(
      { id: userIdFromDB },
      process.env.SECRET_KEY || "".toString(),
      {
        expiresIn: "30m",
      }
    );

    (await cookies()).set("user", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  } catch (error) {
    return NextResponse.json(
      {
        message: "Login Failed",
        error: (error as Error).message,
      },
      { status: 400 }
    );
  }
};
