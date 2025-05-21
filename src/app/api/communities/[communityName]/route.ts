import prisma from "@/lib/prisma";
import { createResponse } from "@/utils/apiResponseUtils";
import { NextRequest } from "next/server";

interface CommunityDetailsResponse {
  community: {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    iconUrl: string | null;
    bannerUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    memberCount: number;
    postCount: number;
    isMember?: boolean;
    ownerId?: string;
  };
  posts: {
    id: string;
    title: string;
    content: string | null;
    mediaUrl: string | null;
    url: string | null;
    type: "TEXT" | "IMAGE" | "VIDEO" | "LINK";
    upvotes: number;
    createdAt: Date;
    commentCount: number;
    author: {
      id: string;
      username: string;
    };
  }[];
}

type Params = Promise<{ communityName: string }>;

export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const { communityName } = await segmentData.params;
    if (!communityName) {
      return createResponse(400, null, "Community name is required");
    }

    // Get userId from query params if it exists
    const userId = request.nextUrl.searchParams.get("userId");

    const [community, posts, adminMember] = await prisma.$transaction([
      prisma.community.findUnique({
        where: { name: communityName },
        select: {
          id: true,
          name: true,
          displayName: true,
          description: true,
          iconUrl: true,
          bannerUrl: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              members: true,
              posts: true,
            },
          },
        },
      }),
      prisma.post.findMany({
        where: { community: { name: communityName } },
        select: {
          id: true,
          title: true,
          content: true,
          mediaUrl: true,
          url: true,
          type: true,
          upvotes: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      // Find the admin member of this community
      prisma.communityMember.findFirst({
        where: {
          community: { name: communityName },
          role: "ADMIN",
        },
        select: {
          userId: true,
        },
      }),
    ]);

    let foundUserMembership = null;
    if (userId && community) {
      foundUserMembership = await prisma.communityMember.findUnique({
        where: {
          userId_communityId: {
            userId,
            communityId: community.id,
          },
        },
      });
    }

    if (!community) {
      return createResponse(404, null, "Community not found");
    }

    const isMember = Boolean(userId && foundUserMembership);
    const ownerId = adminMember?.userId || null;

    const responseData: CommunityDetailsResponse = {
      community: {
        ...community,
        memberCount: community._count.members,
        postCount: community._count.posts,
        ...(userId && { isMember }),
        ...(ownerId && { ownerId }), // Include ownerId if it exists
      },
      posts: posts.map((post) => ({
        ...post,
        commentCount: post._count.comments,
        author: {
          id: post.author.id,
          username: post.author.username,
        },
      })),
    };
    console.log(" responseData:", responseData);

    return createResponse(200, responseData);
  } catch (error) {
    console.error("Error fetching community details:", error);
    return createResponse(500, null, "Failed to fetch community details");
  }
}
