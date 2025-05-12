"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const HeaderBar = () => {
  const { communityName } = useParams();
  console.log(" communityName:", communityName);

  return (
    <div className="w-[100%] h-[60px] flex items-center border-b border-[#212121]">
      <div className="w-[50%] h-[100%]"></div>
      <div className="w-[50%] h-[100%] flex justify-end items-center px-[10px]">
        <Link
          href={`/home/r/${communityName}/submit`}
          className="h-[100%] aspect-[1/2] flex items-center justify-center p-[5px]"
        >
          <Icon icon="majesticons:plus" width="20" height="20" />
        </Link>
        <div className="h-[100%] aspect-square flex items-center justify-center p-[10px]">
          <div className="w-[100%] h-[100%] border border-[#212121] rounded-full bg-gray-400/10"></div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
