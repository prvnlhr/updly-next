import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createResponse } from "@/utils/apiResponseUtils";

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // Search communities by name or displayName, limit to 5 results
    const communities = (await prisma.community.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            displayName: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
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
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    })) as CommunityResponse[];

    // Transform the data to match your preferred format
    const transformCommunity = (
      community: CommunityResponse
    ): TransformedCommunity => ({
      id: community.id,
      name: community.name,
      displayName: community.displayName,
      description: community.description,
      iconUrl: community.iconUrl,
      bannerUrl: community.bannerUrl,
      createdAt: community.createdAt,
      memberCount: community._count.members,
      postCount: community._count.posts,
    });

    const responseData = communities.map(transformCommunity);

    return createResponse(200, responseData);
  } catch (error) {
    console.error("Error searching communities:", error);
    return createResponse(500, null, error, "Failed to search communities");
  }
}
