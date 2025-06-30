import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {IUser} from "@interfaces/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getAuth(): IUser {
  return JSON.parse(localStorage.getItem("auth")!)
}