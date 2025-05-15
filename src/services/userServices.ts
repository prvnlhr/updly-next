import { UserCommunitiesResponse } from "@/types/communityTypes";

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

export async function getUserCommunities(
  userId: string
): Promise<UserCommunitiesResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/users/${userId}/communities`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Get User Communities Error:",
        result.error || result.message
      );
      throw new Error(result.error || "Failed to fetch user communities");
    }

    return result.data;
  } catch (error) {
    console.error("Get User Communities Failed:", error);
    throw error;
  }
}
