import React from "react";
import NavigationSidebar from "../Pages/Feed/NavigationSidebar";
import HeaderBar from "./HeaderBar";
import { getUserCommunities } from "@/services/userServices";
import { UserCommunitiesResponse } from "@/types/communityTypes";

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const sidebarData: UserCommunitiesResponse = await getUserCommunities(
    "85d88c8a-e929-41d1-af44-795bdd5c7167"
  );
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <HeaderBar />
      <div className="w-[100%] h-[calc(100%-60px)] flex">
        <NavigationSidebar sidebarData={sidebarData}/>
        <div className="flex-1 h-[100%] flex min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
