import { oAuth2Client } from "@/lib/auth";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest) => {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      throw new Error("Code are required!");
    }
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    const OAuth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });

    const { data } = await OAuth2.userinfo.get();

    if (!data) {
      throw new Error("Cannot getting user data!");
    }

    const { email, name } = data;

    if (!email || !name) {
      throw new Error("Email dan Username tidak didapatkan");
    }
    let user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, username: name },
      });
    }

    const { id } = user;

    if (!user.isAuthenticated) {
      await prisma.user.update({
        where: { id },
        data: { isAuthenticated: true },
      });
    }

    const token = jwt.sign({ id }, process.env.SECRET_KEY || "".toString(), {
      expiresIn: "30m",
    });
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
        message: (error as Error).message || "Google Auth Failed",
        error: true,
      },
      { status: 400 }
    );
  }
};
