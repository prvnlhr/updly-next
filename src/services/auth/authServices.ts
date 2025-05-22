export interface SignUpResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  message?: string;
  error?: string;
}
const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  process.env.API_BASE_URL ||
  "https://updly-next.vercel.app";

interface SignUpData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export const signUpUser = async (
  userData: SignUpData
): Promise<SignUpResponse> => {
  try {
    // Remove confirmPassword before sending to backend

    const response = await fetch(`${BASE_URL}/api/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle API error responses (400, 409, 500 etc.)
      return {
        success: false,
        error: result.error || "Signup failed. Please try again.",
      };
    }

    // Handle successful response
    return {
      success: true,
      user: result.data?.user,
      message: result.data?.message || "Account created successfully!",
    };
  } catch (error) {
    console.error("Signup service error:", error);
    // Handle network errors or other exceptions
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
};
