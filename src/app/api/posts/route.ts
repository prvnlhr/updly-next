import { createResponse } from "@/utils/apiResponseUtils";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

interface CreatePostRequest {
  title: string;
  content?: string;
  communityId: string;
  authorId: string;
  type: "TEXT" | "IMAGE" | "VIDEO";
  mediaUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePostRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.communityId || !body.authorId) {
      return createResponse(
        400,
        null,
        "Title, communityId, and authorId are required"
      );
    }

    // Validate post type specific requirements
    if (body.type === "TEXT" && !body.content) {
      return createResponse(400, null, "Content is required for text posts");
    }

    if ((body.type === "IMAGE" || body.type === "VIDEO") && !body.mediaUrl) {
      return createResponse(
        400,
        null,
        "Media URL is required for image/video posts"
      );
    }

    // Verify user is a member of the community
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: body.authorId,
          communityId: body.communityId,
        },
      },
    });

    if (!membership) {
      return createResponse(
        403,
        null,
        "User is not a member of this community"
      );
    }

    // Create the post within a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the post
      const post = await tx.post.create({
        data: {
          title: body.title,
          content: body.content,
          type: body.type,
          mediaUrl: body.mediaUrl,
          authorId: body.authorId,
          communityId: body.communityId,
        },
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

      // 2. Create an automatic upvote from the author
      await tx.vote.create({
        data: {
          isUpvote: true,
          userId: body.authorId,
          postId: post.id,
        },
      });

      // 3. Update post's upvote count
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
