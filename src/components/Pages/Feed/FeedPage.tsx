import React from "react";
import MainFeed from "./MainFeed";
import CreateCommunityModal from "@/components/Modal/CreateCommunityModal";
import { FeedPost } from "@/types/feedTypes";

interface FeedPageProps {
  feeds: FeedPost[];
  createCommunity: boolean;
}
const FeedPage: React.FC<FeedPageProps> = async ({
  createCommunity,
  feeds,
}) => {
  return (
    <div className="w-full h-[100%] flex">
      {createCommunity && <CreateCommunityModal />}
      <MainFeed feeds={feeds}/>
      <div className="w-[25%] h-[100%]"></div>
    </div>
  );
};

export default FeedPage;
