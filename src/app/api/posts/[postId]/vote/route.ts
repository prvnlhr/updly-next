import prisma from "@/lib/prisma";
import { createResponse } from "@/utils/apiResponseUtils";
import { NextRequest } from "next/server";

type Params = Promise<{ postId: string }>;

interface VoteRequest {
  userId: string;
  voteType: "up" | "down";
}

export async function POST(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const { postId } = await segmentData.params;
    const { userId, voteType } = (await request.json()) as VoteRequest;

    if (!postId || !userId) {
      return createResponse(400, null, "Post ID and User ID are required");
    }

    // Check if user already voted on this post
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    let isUpvote: boolean | null = null;
    let scoreChange = 0;

    await prisma.$transaction(async (tx) => {
      if (existingVote) {
        // User already voted - check if they're changing their vote
        if (
          (voteType === "up" && existingVote.isUpvote) ||
          (voteType === "down" && !existingVote.isUpvote)
        ) {
          // Removing vote
          await tx.vote.delete({
            where: {
              id: existingVote.id,
            },
          });
          scoreChange = existingVote.isUpvote ? -1 : 1;
          isUpvote = null;
        } else {
          // Changing vote
          await tx.vote.update({
            where: {
              id: existingVote.id,
            },
            data: {
              isUpvote: voteType === "up",
            },
          });
          scoreChange = voteType === "up" ? 2 : -2; // +1 for new vote, -1 for old vote
          isUpvote = voteType === "up";
        }
      } else {
        // New vote
        await tx.vote.create({
          data: {
            isUpvote: voteType === "up",
            userId,
            postId,
          },
        });
        scoreChange = voteType === "up" ? 1 : -1;
        isUpvote = voteType === "up";
      }

      // Update post score
      await tx.post.update({
        where: {
          id: postId,
        },
        data: {
          upvotes: {
            increment: scoreChange,
          },
        },
      });
    });

    // Get updated score
    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { upvotes: true },
    });

    return createResponse(200, {
      isUpvote,
      newScore: updatedPost?.upvotes || 0,
    });
  } catch (error) {
    console.error("Error processing vote:", error);
    return createResponse(500, null, error, "Failed to process vote");
  }
}
