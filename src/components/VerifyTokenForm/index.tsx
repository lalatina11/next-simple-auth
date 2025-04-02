"use client";
import VerifySubmitBtton from "@/components/SubmitButtons/VerifySubmitBtton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { UserForm } from "@/lib/interfaces";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

const VerifyTokenForm = () => {
  const [identifier, setIdentifier] = useState<string | null>("");
  const [erorrs, setErorrs] = useState({
    email: "",
    otp: "",
    server: "",
  });

  const router = useRouter();

  useEffect(() => {
    const identifierFromLocal = sessionStorage.getItem("identifier");
    if (!identifierFromLocal) {
      toast("anda masuk ke halaman ini dengan cara yang tidak benar!");
      setTimeout(() => {
        router.replace("/");
      }, 1500);
    }
    setIdentifier(identifierFromLocal);
  }, [identifier]);

  const handleSendOtp: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { identifier, otp } = Object.fromEntries(
      formData.entries()
    ) as unknown as UserForm;
    if (!identifier || !otp) {
      setErorrs((prev) => {
        return { ...prev, email: "email harus diisi", otp: "OTP harus diisi" };
      });
      return;
    }

    try {
      const res = await fetch("/api/auth/user/verify", {
        method: "POST",
        body: JSON.stringify({ identifier, otp }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErorrs((prev) => {
          return { ...prev, server: "Something went wrong" };
        });
      } else if (result?.error) {
        setErorrs((prev) => {
          return { ...prev, server: result.message };
        });
      } else {
        toast(
          "Akun anda berhasil di verifikasi,\nanda akan diarahkan ke halaman login!"
        );
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      }
    } catch (err) {
      console.log((err as Error).message);
      setErorrs((prev) => {
        return { ...prev, server: (err as Error).message };
      });
    }
  };

  const handleResendOtp: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    if (!email) {
      toast("Terjadi masalah \nsilahkan coba lagi beberapa saat");
      return;
    }
  };

  return (
    <Card className="w-1/2 mx-auto">
      <CardHeader>
        <CardTitle>Verified Your Account</CardTitle>
        <CardDescription>OTP code was Sent To your Email!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendOtp} className="">
          <div className="grid w-full items-center gap-4 space-y-4">
            <span
              className="text-red-500 w-max mx-auto"
              hidden={!erorrs.server}
            >
              {erorrs.server}
            </span>
            <div hidden className="flex flex-col space-y-2">
              <Label htmlFor="identifier">Email</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                hidden
                placeholder="Your Email"
                defaultValue={identifier ?? ""}
              />
              <small className="text-red-500">{erorrs.email ?? ""}</small>
            </div>
            {/* <div className="flex flex-col space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input id="otp" name="otp" type="number" placeholder="Your OTP" />
              <small className="text-red-500">{erorrs.otp ?? ""}</small>
            </div> */}
            <div className="w-max mx-auto">
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} name="otp">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <VerifySubmitBtton />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-4 items-center">
        <span>Have no OTP?</span>
        <form onSubmit={handleResendOtp}>
          <div hidden className="flex flex-col space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              hidden={!!identifier}
              placeholder="Your Email"
              defaultValue={identifier ?? ""}
            />
            <small className="text-red-500">{erorrs.email ?? ""}</small>
          </div>
          <Button variant={"link"}>Resend OTP</Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default VerifyTokenForm;
