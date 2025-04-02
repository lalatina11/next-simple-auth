"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

const RegisterSubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>{pending ? "Loading" : "Register Now"} </Button>
  );
};

export default RegisterSubmitButton;
