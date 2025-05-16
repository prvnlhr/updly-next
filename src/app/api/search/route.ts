// src/app/api/search/route.ts
import { createResponse } from "@/utils/apiResponseUtils";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

interface SearchResult {
  communities: {
    id: string;
    name: string;
    displayName: string;
    iconUrl: string | null;
    memberCount: number;
  }[];
  posts: {
    id: string;
    title: string;
    community: {
      name: string;
      displayName: string;
    };
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get("q");
    const limit = Number(request.nextUrl.searchParams.get("limit")) || 5;

    if (!searchQuery || searchQuery.trim().length < 2) {
      return createResponse(
        400,
        null,
        "Search query must be at least 2 characters"
      );
    }

    const [communities, posts] = await prisma.$transaction([
      // Search communities
      prisma.community.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { displayName: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          displayName: true,
          iconUrl: true,
          _count: {
            select: {
              members: true,
            },
          },
        },
        take: limit,
      }),
      // Search posts
      prisma.post.findMany({
        where: {
          title: { contains: searchQuery, mode: "insensitive" },
        },
        select: {
          id: true,
          title: true,
          community: {
            select: {
              name: true,
              displayName: true,
            },
          },
        },
        take: limit,
        orderBy: {
          upvotes: "desc", // Show most upvoted posts first
        },
      }),
    ]);

    const responseData: SearchResult = {
      communities: communities.map((community) => ({
        id: community.id,
        name: community.name,
        displayName: community.displayName,
        iconUrl: community.iconUrl,
        memberCount: community._count.members,
      })),
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        community: {
          name: post.community.name,
          displayName: post.community.displayName,
        },
      })),
    };

    return createResponse(200, responseData);
  } catch (error) {
    console.error("Search error:", error);
    return createResponse(500, null, "Failed to perform search");
  }
}
