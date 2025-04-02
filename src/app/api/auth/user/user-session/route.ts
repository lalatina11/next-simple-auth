import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const token = (await cookies()).get("user")?.value;
    const allCookie = await cookies();

    // const cookieStore

    if (!token) {
      throw new Error("Token are Required!");
    }

    const decodeToken = jwt.verify(
      token,
      process.env.SECRET_KEY || "".toString()
    ) as JwtPayload;

    const user = await prisma.user.findFirst({ where: { id: decodeToken.id } });

    if (!user) throw new Error("Invalid Token");
    return NextResponse.json(
      { user, message: "Success Getting User", error: false, allCookie },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        user: null,
        message: (error as Error).message,
        error: true,
        allCookie: null,
      },
      { status: 400 }
    );
  }
  // return NextResponse.json(allCookie.getAll());
};
