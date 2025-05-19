import React from "react";
import FeedPage from "@/components/Pages/Feed/FeedPage";
import { getUserFeed } from "@/services/user/feedServices";
import { getPublicFeed } from "@/services/public/feedServices";
import { FeedPost } from "@/types/feedTypes";
import { auth } from "@/auth";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const session = await auth();
  const userId = session?.user.id;
  let feeds: FeedPost[] = [];
  if (userId) {
    feeds = await getUserFeed(userId);
  } else {
    feeds = await getPublicFeed();
  }
  console.log(" feeds:", feeds);
  const { "create-community": createCommunity } = await searchParams;

  return (
    <FeedPage feeds={feeds} createCommunity={createCommunity === "true"} />
  );
};

export default Page;
