"use client";

import { FormEventHandler, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await fetch("/api/auth/user/logout", {
      method: "POST",
      credentials: "include",
    });
    toast("Logout Berhasil");
    setTimeout(() => {
      router.replace("/login");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          Logout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>Apakah anda yakin akan keluar?</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogout} className="w-full flex justify-end">
          <Button className="cursor-pointer">Logout</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutButton;
