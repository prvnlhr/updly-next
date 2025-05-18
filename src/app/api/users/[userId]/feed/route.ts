import prisma from "@/lib/prisma";
import { createResponse } from "@/utils/apiResponseUtils";
import { NextRequest } from "next/server";

type Params = Promise<{ userId: string }>;

export interface FeedPost {
  id: string;
  title: string;
  content: string | null;
  mediaUrl: string | null;
  url: string | null;
  type: "TEXT" | "IMAGE" | "VIDEO" | "LINK";
  upvotes: number;
  createdAt: Date;
  author: {
    id: string;
    username: string;
  };
  community: {
    id: string;
    name: string;
    displayName: string;
  };
  commentCount: number;
  userVote: boolean | null; // true=upvote, false=downvote, null=no vote
}

export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const { userId } = await segmentData.params;

    // 1. Get user's joined communities
    const userCommunities = await prisma.communityMember.findMany({
      where: { userId },
      select: { communityId: true },
    });

    // 2. Fetch posts from user's communities with vote status
    const posts = await prisma.post.findMany({
      where: {
        communityId: {
          in: userCommunities.map((c) => c.communityId),
        },
      },
      orderBy: {
        createdAt: "desc",
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
        _count: {
          select: {
            comments: true,
          },
        },
        Vote: userId
          ? {
              where: {
                userId,
              },
              select: {
                isUpvote: true,
              },
            }
          : false,
      },
    });

    // 3. Transform the data
    const feedPosts: FeedPost[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      mediaUrl: post.mediaUrl,
      url: post.url,
      type: post.type,
      upvotes: post.upvotes,
      createdAt: post.createdAt,
      author: post.author,
      community: post.community,
      commentCount: post._count.comments,
      userVote: post.Vote?.[0]?.isUpvote ?? null,
    }));

    return createResponse(200, feedPosts);
  } catch (error) {
    console.error("Error fetching feed:", error);
    return createResponse(500, null, "Failed to fetch feed");
  }
}
