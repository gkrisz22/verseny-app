import { db } from "@/lib/db";
import { UserService } from "./user.service";

export const services = {
  UserService: UserService.getInstance(db),
};