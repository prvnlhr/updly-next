"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

interface AuthenticateResponse {
  success?: boolean;
  message?: string;
  error?: {
    message: string;
    details?: string;
  };
}

export async function authenticate(
  formData: FormData
): Promise<AuthenticateResponse> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return { success: true, message: "Login successful" };
  } catch (err: unknown) {
    console.error("Authenticate error:", err);

    if (err instanceof AuthError) {
      return { error: { message: err.message } };
    }

    if (err instanceof Error) {
      return {
        error: {
          message: "Failed to login",
          details: err.message,
        },
      };
    }

    return {
      error: {
        message: "Failed to login",
        details: "Unknown error occurred",
      },
    };
  }
}
