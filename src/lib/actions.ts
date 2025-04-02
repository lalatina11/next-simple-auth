"use server";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const getUserSession = async () => {
  const token = (await cookies()).get("user")?.value;

  if (!token) {
    return null;
  }

  const decodeToken = jwt.verify(
    token,
    process.env.SECRET_KEY || "".toString()
  ) as JwtPayload;

  const user = await prisma.user.findFirst({ where: { id: decodeToken.id } });
  if (!user) return null;
  return user;
};
