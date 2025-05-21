import { revalidatePathHandler, revalidateTagHandler } from "@/revalidation";
import { UserCommunitiesResponse } from "@/types/communityTypes";
import { uploadToCloudinary } from "@/utils/cloudinaryConfig";

const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_URL || "https://updly-next.vercel.app";

interface CreateCommunityParams {
  name: string;
  description: string;
  icon?: File;
  banner?: File;
  topics: string[];
  userId: string;
}

export async function createCommunity(data: CreateCommunityParams) {
  try {
    // Upload files to Cloudinary if they exist
    const [iconResponse, bannerResponse] = await Promise.all([
      data.icon ? uploadToCloudinary(data.icon) : null,
      data.banner ? uploadToCloudinary(data.banner) : null,
    ]);

    const payload = {
      name: data.name,
      displayName: data.name, // Using name as displayName
      description: data.description,
      iconUrl: iconResponse?.secure_url || null,
      bannerUrl: bannerResponse?.secure_url || null,
      topics: data.topics,
      creatorId: data.userId,
    };

    const response = await fetch(`${BASE_URL}/api/communities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Create Community Error:", result.error || result.message);
      throw new Error(result.error || "Failed to create community");
    }
    await revalidateTagHandler("userCommunties");
    return result.data;
  } catch (error) {
    console.error("Create Community Failed:", error);
    throw error;
  }
}

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
        next: {
          tags: ["userCommunties"],
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

export async function getCommunityDetails(
  communityName: string,
  userId: string
) {
  try {
    // Include userId in the query params if provided
    const url = new URL(`${BASE_URL}/api/communities/${communityName}`);
    if (userId) {
      url.searchParams.append("userId", userId);
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["communityDetails"],
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

export async function toggleCommunityMembership(
  userId: string,
  communityId: string
): Promise<{ isMember: boolean }> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/users/${userId}/communities/${communityId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Toggle Membership Error:", result.error || result.message);
      throw new Error(result.error || "Failed to toggle community membership");
    }

    await revalidateTagHandler("communityDetails");
    await revalidatePathHandler("/", "layout");
    return { isMember: result.data?.isMember ?? false };
  } catch (error) {
    console.error("Toggle Membership Failed:", error);
    throw error;
  }
}
