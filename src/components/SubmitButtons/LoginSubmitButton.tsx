"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

const LoginSubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>{pending ? "Loading" : "Login"} </Button>
  );
};

export default LoginSubmitButton;
