// src/services/feedService.ts
import { FeedPost } from "@/types/feedTypes";

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

export async function getPublicFeed(): Promise<FeedPost[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/public/feed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Get Public Feed Error:", result.error || result.message);
      throw new Error(result.error || "Failed to fetch public feed");
    }

    return result.data;
  } catch (error) {
    console.error("Get Public Feed Failed:", error);
    throw error;
  }
}
