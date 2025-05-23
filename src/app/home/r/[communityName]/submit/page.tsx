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
  const communityDetails: CommunityDetails = await getCommunityDetails(
    communityName,
    userId
  );

  return <CreatePostPage communityDetails={communityDetails.community} />;
};

export default page;
