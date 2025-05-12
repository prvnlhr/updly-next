import React from "react";
import NavigationSidebar from "../Pages/Feed/NavigationSidebar";
import HeaderBar from "./HeaderBar";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <HeaderBar />
      <div className="w-[100%] h-[calc(100%-60px)] flex">
        <NavigationSidebar />
        <div className="flex-1 h-[100%] flex min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
