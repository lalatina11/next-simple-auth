import { validateEmail } from "@/lib";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashSync } from "bcrypt-ts";
import { otp, otpStore, transporter } from "@/lib/auth";

export const POST = async (req: NextRequest) => {
  try {
    const {
      email,
      password: passwordFromFE,
      username,
    } = (await req.json()) as User;
    const validEmail = validateEmail(email);
    if (!email || email.trim() === "" || !validEmail) {
      throw new Error("Invalid Email!");
    }
    if (!username || username.trim() === "" || username?.length < 6) {
      throw new Error("Invalid Username!");
    }
    if (
      !passwordFromFE ||
      passwordFromFE.trim() === "" ||
      passwordFromFE?.length < 6
    ) {
      throw new Error("Invalid Password!");
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUsername) {
      throw new Error("Username already used!");
    }

    const existingEmail = await prisma.user.findFirst({ where: { email } });

    if (existingEmail) {
      throw new Error("Email already used!");
    }

    const password = hashSync(passwordFromFE, 12);
    const user = await prisma.user.create({
      data: { username, email, password },
    });

    otpStore.set(user.email, otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP code for Candra Social is: ${otp}`,
    });

    return NextResponse.json({
      message: "Register Success!",
      error: false,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: (error as Error).message,
      error: true,
      status: 500,
    });
  }
};
