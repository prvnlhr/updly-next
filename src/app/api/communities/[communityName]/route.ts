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
    let { communityName } = await segmentData.params;
    if (!communityName) {
      return createResponse(400, null, "Community name is required");
    }
    communityName = `r/${communityName}`;

    const [community, posts] = await prisma.$transaction([
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
    ]);

    if (!community) {
      return createResponse(404, null, "Community not found");
    }

    const responseData: CommunityDetailsResponse = {
      community: {
        ...community,
        memberCount: community._count.members,
        postCount: community._count.posts,
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

    return createResponse(200, responseData);
  } catch (error) {
    console.error("Error fetching community details:", error);
    return createResponse(500, null, "Failed to fetch community details");
  }
}
