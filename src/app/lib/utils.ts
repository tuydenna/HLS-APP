import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {IUser} from "@interfaces/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAuth(): IUser {
  const auth: string | null = localStorage.getItem("auth");
  if (auth) {
    return JSON.parse(auth)
  }
  window.location.href = "/auth/login";
  return auth as unknown as IUser
}