// actions/auth/authenticate.ts
"use server";

import { signIn } from "@/auth";
import { CustomError } from "@/lib/error";
import { AuthError } from "next-auth";

interface AuthenticateResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function authenticate(credentials: {
  email: string;
  password: string;
}): Promise<AuthenticateResponse> {
  try {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      throw new CustomError(result.error);
    }

    return { success: true, message: "Login successful" };
  } catch (error: unknown) {
    console.error("Authenticate error:", error);

    if (error instanceof CustomError) {
      return { error: error.message };
    }

    if (error instanceof AuthError) {
      return { error: error.message || "Authentication failed" };
    }

    if (error instanceof Error) {
      return {
        error: error.message.includes("fetch")
          ? "Connection failed. Please try again."
          : error.message,
      };
    }

    return { error: "An unexpected error occurred" };
  }
}
