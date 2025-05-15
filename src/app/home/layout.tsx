import HomeLayout from "@/components/Layouts/HomeLayout";
import React from "react";

const UpdlyHome = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  
  return <HomeLayout>{children}</HomeLayout>;
};

export default UpdlyHome;
