// app/api/auth/signin/route.ts
import { createResponse } from "@/utils/apiResponseUtils";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

const AuthMessages = {
  USER_NOT_FOUND: "No account found with this email or username",
  INVALID_PASSWORD: "Incorrect password",
  AUTH_ERROR: "Authentication failed. Please try again later.",
} as const;

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      return createResponse(
        400,
        null,
        "Invalid input: " + parsed.error.errors[0].message
      );
    }

    const { email, password } = parsed.data;
    console.log(" email:", email);
    console.log(" password:", password);

    // Find user by email or username
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(" user:", user);
    if (!user) {
      return createResponse(401, null, AuthMessages.USER_NOT_FOUND);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return createResponse(401, null, AuthMessages.INVALID_PASSWORD);
    }

    // Return user data
    return createResponse(
      200,
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      null,
      "Sign-in successful"
    );
  } catch (error: unknown) {
    console.error("SignIn error:", error);
    const errorMessage =
      error instanceof Error ? error.message : AuthMessages.AUTH_ERROR;
    return createResponse(500, null, errorMessage);
  }
}
