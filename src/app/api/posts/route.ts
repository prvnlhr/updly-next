import { createResponse } from "@/utils/apiResponseUtils";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

interface CreatePostRequest {
  title: string;
  content?: string;
  communityId: string;
  authorId: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "LINK";
  mediaUrl?: string;
  url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePostRequest = await request.json();
    if (!body.title || !body.communityId || !body.authorId) {
      return createResponse(
        400,
        null,
        "Title, communityId, and authorId are required"
      );
    }

    // Validate post type specific requirements
    switch (body.type) {
      case "TEXT":
        if (!body.content) {
          return createResponse(
            400,
            null,
            "Content is required for text posts"
          );
        }
        break;
      case "IMAGE":
      case "VIDEO":
        if (!body.mediaUrl) {
          return createResponse(
            400,
            null,
            "Media URL is required for image/video posts"
          );
        }
        break;
      case "LINK":
        if (!body.url) {
          return createResponse(400, null, "URL is required for link posts");
        }
        try {
          new URL(body.url);
        } catch {
          return createResponse(400, null, "Invalid URL format");
        }
        break;
      default:
        return createResponse(400, null, "Invalid post type");
    }

    // Verify user is a member of the community
    // const membership = await prisma.communityMember.findUnique({
    //   where: {
    //     userId_communityId: {
    //       userId: body.authorId,
    //       communityId: body.communityId,
    //     },
    //   },
    // });

    // if (!membership) {
    //   return createResponse(
    //     403,
    //     null,
    //     "User is not a member of this community"
    //   );
    // }

    // Prepare post data
    const postData = {
      title: body.title,
      content: body.content || null,
      type: body.type,
      mediaUrl: body.mediaUrl || null,
      url: body.type === "LINK" ? body.url : null,
      authorId: body.authorId,
      communityId: body.communityId,
    };

    // Create the post within a transaction
    const result = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: postData,
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          community: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
        },
      });

      await tx.vote.create({
        data: {
          isUpvote: true,
          userId: body.authorId,
          postId: post.id,
        },
      });

      await tx.post.update({
        where: { id: post.id },
        data: {
          upvotes: { increment: 1 },
        },
      });

      return post;
    });

    return createResponse(201, result);
  } catch (error) {
    console.error("Error creating post:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
