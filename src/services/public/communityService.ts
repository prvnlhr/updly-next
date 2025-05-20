const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_URL || "https://updly-next.vercel.app";

interface CommunitySearchResult {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  createdAt: Date;
  memberCount: number;
  postCount: number;
}

export async function searchCommunities(
  query: string
): Promise<CommunitySearchResult[]> {
  try {
    const url = new URL(`${BASE_URL}/api/communities/search`);
    url.searchParams.append("q", query);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["communitySearch"],
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Search Communities Error:",
        result.error || result.message
      );
      throw new Error(result.error || "Failed to search communities");
    }

    return result.data;
  } catch (error) {
    console.error("Search Communities Failed:", error);
    throw error;
  }
}
