import CreatePostPage from "@/components/Pages/Post/CreatePostPage";
import { getCommunityDetails } from "@/services/user/communityServices";
import { CommunityDetails } from "@/types/communityTypes";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ [key: string]: string }>;
}) => {
  const { communityName } = await params;
  const communityDetails: CommunityDetails = await getCommunityDetails(
    communityName
  );
  return <CreatePostPage communityDetails={communityDetails} />;
};

export default page;
