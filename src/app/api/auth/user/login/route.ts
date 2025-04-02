import { UserForm } from "@/lib/interfaces";
import { prisma } from "@/lib/prisma";
import { compareSync } from "bcrypt-ts";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { errorOtpMessage } from "@/lib";
import { otp, otpStore, transporter } from "@/lib/auth";

export const POST = async (req: NextRequest) => {
  try {
    const { identifier, password: passwordFromFE } =
      (await req.json()) as UserForm;

    if (!identifier || identifier.trim() === "" || identifier?.length < 6) {
      throw new Error("Invalid Email!");
    }
    if (
      !passwordFromFE ||
      passwordFromFE.trim() === "" ||
      passwordFromFE?.length < 6
    ) {
      throw new Error("Invalid Email!");
    }

    const validateIdentifier = await prisma.user.findFirst({
      where: { OR: [{ username: identifier }, { password: identifier }] },
    });

    if (!validateIdentifier) {
      throw new Error("Akun tidak ditemukan!");
    }

    if (!validateIdentifier.password) {
      throw new Error("Password tidak sesuai!");
    }

    const validatePassword = compareSync(
      passwordFromFE,
      validateIdentifier.password
    );

    if (!validatePassword) {
      throw new Error("Password tidak sesuai!");
    }

    if (!validateIdentifier.isAuthenticated) {
      otpStore.set(validateIdentifier.email, otp);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: validateIdentifier.email,
        subject: "Your OTP Code",
        text: `Your OTP code for Candra Social is: ${otp}`,
      });
      throw new Error(errorOtpMessage);
    }

    const { id } = validateIdentifier;

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

    return NextResponse.json({
      message: "login Success!",
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
