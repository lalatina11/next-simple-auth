"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";
import { errorOtpMessage } from "@/lib";
import { UserForm } from "@/lib/interfaces";
import LoginSubmitButton from "../SubmitButtons/LoginSubmitButton";
import AuthOption from "../Authoption";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isError, setIsError] = useState({
    identifier: "",
    password: "",
  });

  const router = useRouter();

  const [errorBack, setErrorBack] = useState<string | boolean>(false);

  // if (isAuthenticated) return router.replace("/");

  const handleRegister: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { identifier, password } = Object.fromEntries(
      formData.entries()
    ) as unknown as UserForm;

    if (!identifier || identifier.trim() === "" || identifier.length < 6) {
      setIsError((prev) => {
        return {
          ...prev,
          identifier: "Email atau Username harus diisi mimimal 6 karakter",
        };
      });
    } else if (!password || password.trim() === "" || password.length < 6) {
      setIsError((prev) => {
        return { ...prev, password: "Password harus diisi mimimal 6 karakter" };
      });
    } else {
      const res = await fetch("/api/auth/user/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
        credentials: "include",
      });
      const result = await res.json();
      console.log(result);

      if (!res.ok || result.error || result.message === errorOtpMessage) {
        sessionStorage.setItem("identifier", identifier);
        toast(errorOtpMessage);
        setTimeout(() => {
          router.replace("/verify");
        }, 1500);
      } else if (!res.ok || result.error) {
        setErrorBack(result.error);
      } else {
        toast("Login berhasil,\n anda akan diarahkan ke home page!");
        setTimeout(() => {
          router.replace("/");
        }, 1500);
        localStorage.removeItem("email");
      }
    }
  };

  return (
    <Card className="w-1/2 mx-auto mb-10">
      <CardHeader>
        <CardTitle>Login into Your Account</CardTitle>
        <CardDescription>
          Don&apos;t have an Account?{" "}
          <Link className={"text-blue-400"} href={"/register"}>
            Register Here
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="">
          <div className="grid w-full items-center gap-4 space-y-4">
            <span hidden={!isError} className="text-red-500">
              {errorBack ?? null}
            </span>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="identifier">Email atau Username</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="Your identifier"
              />
              <small hidden={!isError} className="text-red-500">
                {isError.identifier ?? null}
              </small>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={isShowPassword ? "text" : "password"}
                placeholder="Your Password"
              />
              <small hidden={!isError} className="text-red-500">
                {isError.password ?? null}
              </small>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isShowPassword"
                onCheckedChange={(check) => setIsShowPassword(!!check)}
              />
              <label
                htmlFor="isShowPassword"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Password
              </label>
            </div>
            <LoginSubmitButton />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-center">
        <div className="flex justify-between items-center gap-6 w-full">
          <div className="bg-zinc-500 h-[1px] w-full" />
          <span className="text-nowrap">or Login with</span>
          <div className="bg-zinc-500 h-[1px] w-full" />
        </div>
        <AuthOption />
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
