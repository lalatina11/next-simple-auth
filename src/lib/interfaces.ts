import { User } from "@prisma/client";

export interface UserForm extends User {
  otp: string | null;
  identifier: string | null;
}
