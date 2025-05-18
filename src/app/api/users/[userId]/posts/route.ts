import prisma from "@/lib/prisma";
import { createResponse } from "@/utils/apiResponseUtils";
import { NextRequest } from "next/server";
type Params = Promise<{ userId: string }>;

interface VoteRequest {
  postId: string;
}
export async function POST(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const { userId } = await segmentData.params;
    const { postId }: VoteRequest = await request.json();

    // Validate inputs
    if (!userId) return createResponse(400, null, "User ID is required");
    if (!postId) return createResponse(400, null, "Post ID is required");

    // Handle vote in transaction
    const result = await prisma.$transaction(async (tx) => {
      const existingVote = await tx.vote.findUnique({
        where: { userId_postId: { userId, postId } },
      });

      // Determine new vote status (toggle if exists, upvote if new)
      const newIsUpvote = existingVote ? !existingVote.isUpvote : true;
      const voteValueChange = calculateVoteChange(existingVote, newIsUpvote);

      // Upsert the vote record
      const vote = await tx.vote.upsert({
        where: { userId_postId: { userId, postId } },
        create: { isUpvote: newIsUpvote, userId, postId },
        update: { isUpvote: newIsUpvote },
      });

      // Update post vote count
      await tx.post.update({
        where: { id: postId },
        data: { upvotes: { increment: voteValueChange } },
      });

      return {
        vote,
        newVoteStatus: newIsUpvote ? "upvoted" : "downvoted",
        previousVoteStatus: existingVote
          ? existingVote.isUpvote
            ? "upvoted"
            : "downvoted"
          : "none",
      };
    });

    return createResponse(200, result);
  } catch (error) {
    console.error("Error processing vote:", error);
    return createResponse(500, null, "Failed to process vote");
  }
}

// Helper function to calculate vote change
function calculateVoteChange(
  existingVote: { isUpvote: boolean } | null,
  newIsUpvote: boolean
): number {
  if (!existingVote) return newIsUpvote ? 1 : -1; // New vote
  if (existingVote.isUpvote === newIsUpvote) return 0; // No change (shouldn't happen)

  // Changing vote direction
  return newIsUpvote ? 2 : -2; // Up from down (+2) or down from up (-2)
}
