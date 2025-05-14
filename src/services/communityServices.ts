import { uploadToCloudinary } from "@/utils/cloudinaryConfig";

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

interface CreateCommunityParams {
  name: string;
  description: string;
  icon?: File;
  banner?: File;
  topics: string[];
  userId: string; // Added userId for creator association
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

    console.log(" payload:", payload);

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

    return result.data;
  } catch (error) {
    console.error("Create Community Failed:", error);
    throw error;
  }
}
