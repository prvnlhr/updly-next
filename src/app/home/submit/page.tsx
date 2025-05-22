import { auth } from "@/auth";
import CreatePostPage from "@/components/Pages/Post/CreatePostPage";
import { getCommunityDetails } from "@/services/user/communityServices";
import { CommunityDetails } from "@/types/communityTypes";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ [key: string]: string }>;
}) => {
  const session = await auth();
  const userId = session?.user.id;
  const { communityName } = await params;
  let communityDetails: CommunityDetails | null = null;
  if (communityName) {
    communityDetails = await getCommunityDetails(communityName, userId);
  }

  const community = communityDetails?.community;

  return <CreatePostPage communityDetails={community} />;
};

export default page;
