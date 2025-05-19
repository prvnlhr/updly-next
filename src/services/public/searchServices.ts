const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_URL || "https://updly-next.vercel.app";

interface SearchResult {
  communities: {
    id: string;
    name: string;
    displayName: string;
    iconUrl: string | null;
    memberCount: number;
  }[];
  posts: {
    id: string;
    title: string;
    community: {
      name: string;
      displayName: string;
    };
  }[];
}

export async function searchContent(
  query: string,
  limit: number = 5
): Promise<SearchResult> {
  try {
    if (!query || query.trim().length < 2) {
      return { communities: [], posts: [] };
    }

    const response = await fetch(
      `${BASE_URL}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Search failed");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Search error:", error);
    return { communities: [], posts: [] };
  }
}
