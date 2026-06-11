"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DEMO_PASSWORD,
  DEMO_USER,
  SESSION_COOKIE,
  sessionToken,
} from "@/lib/auth";

export type LoginState = { error: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (username !== DEMO_USER || password !== DEMO_PASSWORD) {
    return { error: "Ungültige Zugangsdaten." };
  }

  (await cookies()).set(SESSION_COOKIE, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
