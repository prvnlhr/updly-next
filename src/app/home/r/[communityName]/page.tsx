import CommunityPage from "@/components/Pages/Community/CommunityPage";
import { getCommunityDetails } from "@/services/userServices";
import { CommunityDetails } from "@/types/communityTypes";
const page = async ({
  params,
}: {
  params: Promise<{ [key: string]: string }>;
}) => {
  const { communityName } = await params;
  const communityDetails: CommunityDetails = await getCommunityDetails(
    communityName
  );
  console.log(" communityDetails:", communityDetails);
  return <CommunityPage communityDetails={communityDetails} />;
};

export default page;
