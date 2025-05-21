import { revalidatePathHandler } from "@/revalidation";
import { FeedPost } from "@/types/feedTypes";
import { uploadToCloudinary } from "@/utils/cloudinaryConfig";

const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_URL || "https://updly-next.vercel.app";

interface PostCreationData {
  title: string;
  content?: string;
  communityId: string;
  authorId: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "LINK";
  mediaUrl?: string;
  url?: string;
}

interface PostSubmissionData {
  title: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "LINK";
  communityId: string;
  userId: string;
  content?: string;
  media?: FileList;
  url?: string;
}

export async function createPost(data: PostCreationData) {
  try {
    const response = await fetch(`${BASE_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Create Post Error:", result.error || result.message);
      throw new Error(result.error || "Failed to create post");
    }

    return result.data;
  } catch (error) {
    console.error("Create Post Failed:", error);
    throw error;
  }
}

export async function uploadMediaAndCreatePost(
  formData: PostSubmissionData,
  communityId: string,
  userId: string
) {
  try {
    let mediaUrl: string | undefined;
    let postType = formData.type;

    // Handle media upload if present
    if (formData.media && formData.media.length > 0) {
      const file = formData.media[0];

      // Validate file type
      if (!file.type.match(/image\/*|video\/*/)) {
        throw new Error("Only image or video files are allowed");
      }

      const result = await uploadToCloudinary(file);
      mediaUrl = result.secure_url;
      postType = file.type.startsWith("image") ? "IMAGE" : "VIDEO";
    }

    // Handle link posts
    if (formData.type === "LINK" && formData.url) {
      postType = "LINK";
    }

    // Prepare the final post data
    const postCreationData: PostCreationData = {
      title: formData.title,
      content: formData.content || "",
      communityId,
      authorId: userId,
      type: postType,
      mediaUrl,
      url: formData.url,
    };

    return await createPost(postCreationData);
  } catch (error) {
    console.error("Error in uploadMediaAndCreatePost:", error);
    throw error;
  }
}

export async function getUserFeed(userId: string): Promise<FeedPost[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/feed/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Get User Feed Error:", result.error || result.message);
      throw new Error(result.error || "Failed to fetch user feed");
    }

    return result.data;
  } catch (error) {
    console.error("Get User Feed Failed:", error);
    throw error;
  }
}

interface VotePostParams {
  postId: string;
  voteType: "up" | "down";
  userId: string;
}

interface VoteResponse {
  status: "success" | "error";
  action?: "voted" | "removed";
  direction?: "up" | "down" | null;
  newScore?: number;
  error?: string;
}

export const votePost = async ({
  postId,
  voteType,
  userId,
}: VotePostParams): Promise<VoteResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/posts/${postId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voteType,
        userId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Vote failed:", result.error || result.message);
      return {
        status: "error",
        error: result.error || "Failed to process vote",
      };
    }

    await revalidatePathHandler("/home/feed", "layout");
    return {
      status: "success",
      action: result.data.action,
      direction: result.data.direction,
      newScore: result.data.newScore,
    };
  } catch (error) {
    console.error("Vote error:", error);
    return {
      status: "error",
      error: "Network error while processing vote",
    };
  }
};
