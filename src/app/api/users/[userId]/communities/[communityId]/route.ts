import prisma from "@/lib/prisma";
import { createResponse } from "@/utils/apiResponseUtils";
import { NextRequest } from "next/server";

type Params = Promise<{
  communityId: string;
  userId: string;
}>;

export async function POST(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const { communityId, userId } = await segmentData.params;

    if (!communityId || !userId) {
      return createResponse(400, null, "Community ID and User ID are required");
    }

    // Check if user is already a member of the community
    const existingMember = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });

    let action: "joined" | "left";

    if (existingMember) {
      // User is already a member - leave the community
      await prisma.communityMember.delete({
        where: {
          userId_communityId: {
            userId,
            communityId,
          },
        },
      });
      action = "left";
    } else {
      // User is not a member - join the community
      await prisma.communityMember.create({
        data: {
          userId,
          communityId,
          role: "MEMBER",
        },
      });
      action = "joined";
    }

    return createResponse(
      200,
      { isMember: action === "joined" },
      null,
      `Successfully ${action} community`
    );
  } catch (error) {
    console.error("Error toggling community membership:", error);
    return createResponse(
      500,
      null,
      error,
      "Failed to toggle community membership"
    );
  }
}
