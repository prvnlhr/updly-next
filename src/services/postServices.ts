import { FormValues } from "@/types/postTypes";
import { uploadToCloudinary } from "@/utils/cloudinaryConfig";

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

interface CreatePostParams {
  title: string;
  content: string;
  communityId: string;
  authorId: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "LINK";
  mediaUrl?: string;
  url?: string;
}

export async function createPost(data: CreatePostParams) {
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
  formData: FormValues,
  communityId: string,
  userId: string
) {
  try {
    let mediaUrl: string | undefined;
    let postType: "TEXT" | "IMAGE" | "VIDEO" | "LINK" = "TEXT";

    // Handle media upload if present
    if (formData.media && formData.media.length > 0) {
      const file = formData.media[0];
      const result = await uploadToCloudinary(file);
      mediaUrl = result.secure_url;
      postType = file.type.startsWith("image") ? "IMAGE" : "VIDEO";
    }

    // Handle link posts
    if (formData.url) {
      postType = "LINK";
    }

    return await createPost({
      title: formData.title,
      content: formData.content,
      communityId,
      authorId: userId,
      type: postType,
      mediaUrl,
      url: formData.url,
    });
  } catch (error) {
    console.error("Error in uploadMediaAndCreatePost:", error);
    throw error;
  }
}
