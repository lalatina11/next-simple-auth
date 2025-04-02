"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

const VerifySubmitBtton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>{pending ? "Loading" : "Verify Now"} </Button>
  );
};

export default VerifySubmitBtton;
