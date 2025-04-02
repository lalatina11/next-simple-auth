import { UserForm } from "@/lib/interfaces";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { otpStore } from "@/lib/auth";

export const POST = async (req: NextRequest) => {
  try {
    const { otp, identifier } = (await req.json()) as UserForm;

    if (!identifier) {
      throw new Error("Email or Username are Required");
    }

    if (!otp) {
      throw new Error("OTP are Required");
    }
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username: identifier }, { email: identifier }] },
    });

    if (!existingUser) {
      throw new Error("User not available!");
    }

    const storedOtp = otpStore.get(existingUser.email);
    if (!storedOtp || storedOtp !== otp) {
      throw new Error("OTP Tidak valid");
    }

    await prisma.user.update({
      where: { username: existingUser.username },
      data: {
        isAuthenticated: true,
      },
    });

    return NextResponse.json({ message: "OK", error: false }, { status: 202 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error: true },
      { status: 202 }
    );
  }
};
