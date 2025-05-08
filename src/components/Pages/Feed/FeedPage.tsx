import React from "react";
import RecentPosts from "./RecentPosts";
import MainFeed from "./MainFeed";
import NavigationSidebar from "./NavigationSidebar";

const FeedPage = () => {
  return (
    <div className="w-full h-[100%] flex flex-col">
      <div className="w-full h-full flex">
        {/* Left Sidebar */}
        <NavigationSidebar />
        {/* Main Content */}
        <MainFeed />
        {/* Right Sidebar */}
        <RecentPosts />
      </div>
    </div>
  );
};

export default FeedPage;
