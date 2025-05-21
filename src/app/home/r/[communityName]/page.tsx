import { auth } from "@/auth";
import CommunityPage from "@/components/Pages/Community/CommunityPage";
import { getCommunityDetails } from "@/services/user/communityServices";
import { CommunityDetails } from "@/types/communityTypes";
const page = async ({
  params,
}: {
  params: Promise<{ [key: string]: string }>;
}) => {
  const session = await auth();
  const userId = session?.user?.id;
  const { communityName } = await params;
  const communityDetails: CommunityDetails = await getCommunityDetails(
    communityName,
    userId
  );
  console.log(" communityDetails:", communityDetails);
  return <CommunityPage communityDetails={communityDetails} />;
};

export default page;
