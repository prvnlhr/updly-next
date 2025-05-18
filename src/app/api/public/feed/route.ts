import prisma from "@/lib/prisma";
import { createResponse } from "@/utils/apiResponseUtils";

export async function GET() {
  try {
    // Fetch popular public posts
    const posts = await prisma.post.findMany({
      orderBy: { upvotes: "desc" },
      take: 100,
      include: {
        author: { select: { id: true, username: true } },
        community: { select: { id: true, name: true, displayName: true } },
        _count: { select: { comments: true } },
      },
    });

    const feedPosts = posts.map((post) => ({
      ...post,
      commentCount: post._count.comments,
      userVote: null, // No vote status for unauthenticated users
    }));

    return createResponse(200, feedPosts);
  } catch (error) {
    console.error("Error fetching public feed:", error);
    return createResponse(500, null, "Failed to fetch public feed");
  }
}
