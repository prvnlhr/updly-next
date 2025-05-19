import React from "react";
import NavigationSidebar from "../Pages/Feed/NavigationSidebar";
import HeaderBar from "./HeaderBar";
import { UserCommunitiesResponse } from "@/types/communityTypes";
import { getUserCommunities } from "@/services/user/communityServices";
import { auth } from "@/auth";

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  const userId = session?.user?.userId;
  console.log(" userId:", userId);
  const sidebarData: UserCommunitiesResponse = await getUserCommunities(userId);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <HeaderBar />
      <div className="w-[100%] h-[calc(100%-60px)] flex">
        <NavigationSidebar sidebarData={sidebarData} />
        <div className="flex-1 h-[100%] flex min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
