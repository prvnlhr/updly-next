import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

// Zod schema for credentials
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Type for credentials based on Zod schema
type Credentials = z.infer<typeof signInSchema>;

// Type for backend response
interface BackendResponse {
  status: number;
  data?: {
    id: string;
    email: string;
    username: string;
  };
  error?: string;
  message?: string;
}

// Custom error class for authentication errors
class CustomError extends AuthError {
  constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials: unknown) {
        // Validate environment variable
        const apiBaseUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
        if (!apiBaseUrl) {
          throw new CustomError("API base URL is not configured");
        }

        // Validate credentials
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          const errorMessage = parsedCredentials.error.issues
            .map((issue) => issue.message)
            .join(", ");
          throw new CustomError(`Invalid input: ${errorMessage}`);
        }

        const { email, password } = parsedCredentials.data as Credentials;

        try {
          const response = await fetch(`${apiBaseUrl}/api/auth/sign-in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const responseBody: BackendResponse = await response.json();
          console.log("Backend response:", responseBody);

          if (!response.ok) {
            const errorMessage =
              responseBody.error ||
              responseBody.message ||
              "Authentication failed";
            console.error("Backend error:", {
              status: response.status,
              error: errorMessage,
            });
            throw new CustomError(errorMessage);
          }

          if (!responseBody.data) {
            console.error("No user data in API response:", responseBody);
            throw new CustomError("No user data returned from server");
          }

          const userData = responseBody.data;

          // Validate user data structure
          if (!userData.id || !userData.email || !userData.username) {
            console.error("Incomplete user data:", userData);
            throw new CustomError("Invalid user data returned from server");
          }

          return {
            id: userData.id,
            email: userData.email,
            username: userData.username,
          };
        } catch (error: unknown) {
          console.error("Authorize error:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
          });
          // Re-throw as CustomError if not already
          throw error instanceof CustomError
            ? error
            : new CustomError(
                error instanceof Error ? error.message : "Authentication failed"
              );
        }
      },
    }),
  ],
});
