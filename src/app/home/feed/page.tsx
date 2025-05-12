import React from "react";
import FeedPage from "@/components/Pages/Feed/FeedPage";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { "create-community": createCommunity } = await searchParams;
  return <FeedPage createCommunity={createCommunity === "true"} />;
};

export default Page;
