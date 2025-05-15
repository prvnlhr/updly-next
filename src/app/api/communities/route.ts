import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createResponse } from "@/utils/apiResponseUtils";

interface CreateCommunityRequest {
  name: string;
  displayName: string;
  description?: string;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  topics: string[];
  creatorId: string;
}

export async function POST(req: Request) {
  try {
    const body: CreateCommunityRequest = await req.json();

    // Validate required fields
    if (!body.name || !body.creatorId) {
      return NextResponse.json(
        { error: "Name and creatorId are required" },
        { status: 400 }
      );
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the community
      const community = await tx.community.create({
        data: {
          name: body.name,
          displayName: body.displayName,
          description: body.description,
          iconUrl: body.iconUrl,
          bannerUrl: body.bannerUrl,
        },
      });

      // 2. Add creator as admin
      await tx.communityMember.create({
        data: {
          userId: body.creatorId,
          communityId: community.id,
          role: "ADMIN",
        },
      });

      // 3. Handle topics
      if (body.topics && body.topics.length > 0) {
        // First upsert all topics and get their IDs
        const topicRecords = await Promise.all(
          body.topics.map((topicName) =>
            tx.topic.upsert({
              where: { name: topicName },
              update: {},
              create: { name: topicName },
              select: { id: true }, // Only return the id
            })
          )
        );

        // Then create associations using the actual topic IDs
        await tx.communityTopic.createMany({
          data: topicRecords.map((topic) => ({
            communityId: community.id,
            topicId: topic.id,
          })),
          skipDuplicates: true,
        });
      }

      return community;
    });

    return createResponse(201, result);
  } catch (error) {
    console.error("Error creating community:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
