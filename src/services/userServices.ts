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

export async function getCommunityDetails(communityName: string) {
  try {
    // Include userId in the query params if provided
    const url = new URL(`${BASE_URL}/api/communities/${communityName}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Get Community Details Error:",
        result.error || result.message
      );
      throw new Error(result.error || "Failed to fetch community details");
    }

    return result.data;
  } catch (error) {
    console.error("Get Community Details Failed:", error);
    throw error;
  }
}
