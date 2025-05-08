import React from "react";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-[100%] h-[50px] border-b"></div>
      <div className="w-[100%] h-[calc(100%-50px)]">{children}</div>
    </div>
  );
};

export default HomeLayout;
