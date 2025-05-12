import React from "react";
import MainFeed from "./MainFeed";
import CreateCommunityModal from "@/components/Modal/CreateCommunityModal";

const FeedPage = async ({ createCommunity }: { createCommunity: boolean }) => {
  return (
    <div className="w-full h-[100%] flex">
      {createCommunity && <CreateCommunityModal />}
      <MainFeed />
      <div className="w-[25%] h-[100%]"></div>
    </div>
  );
};

export default FeedPage;
