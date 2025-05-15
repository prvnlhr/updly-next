type Params = Promise<{ userId: string }>;
import prisma from "@/lib/prisma";
import { createResponse } from "@/utils/apiResponseUtils";
import { NextRequest } from "next/server";

interface CommunityResponse {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  createdAt: Date;
  _count: {
    members: number;
    posts: number;
  };
}

interface TransformedCommunity {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  createdAt: Date;
  memberCount: number;
  postCount: number;
}

interface ResponseData {
  createdCommunities: TransformedCommunity[];
  joinedCommunities: TransformedCommunity[];
}

export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const { userId } = await segmentData.params;
    if (!userId) {
      return createResponse(400, null, "User ID is required");
    }
    const [createdCommunities, joinedCommunities] = await Promise.all([
      // Communities where user is ADMIN (created)
      prisma.community.findMany({
        where: {
          members: {
            some: {
              userId,
              role: "ADMIN",
            },
          },
        },
        select: {
          id: true,
          name: true,
          displayName: true,
          description: true,
          iconUrl: true,
          bannerUrl: true,
          createdAt: true,
          _count: {
            select: {
              members: true,
              posts: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }) as Promise<CommunityResponse[]>,

      // Communities where user is MEMBER or MODERATOR (joined)
      prisma.community.findMany({
        where: {
          members: {
            some: {
              userId,
              role: {
                in: ["MEMBER", "MODERATOR"],
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          displayName: true,
          description: true,
          iconUrl: true,
          bannerUrl: true,
          createdAt: true,
          _count: {
            select: {
              members: true,
              posts: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }) as Promise<CommunityResponse[]>,
    ]);

    // Transform the data
    const transformCommunity = (
      community: CommunityResponse
    ): TransformedCommunity => ({
      ...community,
      memberCount: community._count.members,
      postCount: community._count.posts,
    });

    const responseData: ResponseData = {
      createdCommunities: createdCommunities.map(transformCommunity),
      joinedCommunities: joinedCommunities.map(transformCommunity),
    };

    return createResponse(200, responseData);
  } catch (error) {
    console.error("Error fetching user communities:", error);
    return createResponse(500, null, error, "Failed to fetch user communities");
  }
}
