import { FeedPost } from "@/types/feedTypes";

const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_URL || "https://updly-next.vercel.app";

export async function getUserFeed(userId: string): Promise<FeedPost[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}/feed/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Get User Feed Error:", result.error || result.message);
      throw new Error(result.error || "Failed to fm=etch user feed");
    }

    return result.data;
  } catch (error) {
    console.error("Get User Feed Failed:", error);
    throw error;
  }
}
