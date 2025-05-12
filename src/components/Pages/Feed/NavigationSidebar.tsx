import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React from "react";
const redditCommunities: string[] = [
  "r/javascript",
  "r/typescript",
  "r/reactjs",
  "r/webdev",
  "r/frontend",
  "r/nextjs",
  "r/node",
  "r/programming",
  "r/learnprogramming",
  "r/coding",
  "r/compsci",
  "r/softwaredevelopment",
  "r/technology",
  "r/startups",
  "r/entrepreneur",
  "r/productivity",
  "r/dataisbeautiful",
  "r/machinelearning",
  "r/AskReddit",
  "r/worldnews",
];

const recentVisited: string[] = [
  "r/typescript",
  "r/nextjs",
  "r/node",
  "r/softwaredevelopment",
  "r/AskReddit",
  "r/worldnews",
];

const NavigationSidebar = () => {
  return (
    <div className="w-[20%] h-full border-r border-[#212121] flex items-center justify-center p-[10px]">
      <div className="w-[80%] h-[90%] flex flex-col overflow-y-scroll hide-scrollbar">
        {/* RECENT VISITED */}

        <div className="w-[100%] h-[auto] flex flex-col border-b border-[#212121] py-[20px]">
          <div className="w-[100%] h-[50px] flex items-center">
            <p className="text-sm text-[#A2A8B2]">RECENT</p>
          </div>

          {recentVisited.map((com, comIndex) => (
            <Link
              href={`/home/${com}`}
              key={comIndex}
              className="w-[100%] h-[40px] flex my-[5px]"
            >
              <div className="h-[100%] aspect-[1/1] border border-[#212121] rounded-full"></div>
              <div className="flex-1 h-[100%] flex items-center justify-start px-[10px] overflow-hidden">
                <p className="text-sm truncate">{com}</p>
              </div>
            </Link>
          ))}
        </div>
        {/* COMMUNTIIES GROUP */}
        <div className="w-[100%] h-[auto] flex flex-col border-b border-[#212121] py-[20px]">
          <div className="w-[100%] h-[50px] flex items-center">
            <p className="text-sm text-[#A2A8B2]">COMMUNITIES</p>
          </div>
          <Link
            href={`?create-community=true`}
            className="w-[100%] h-[40px] flex my-[5px]"
          >
            <div className="h-[100%] aspect-[1/1] flex items-center justify-center border-[#212121] rounded-full">
              <Icon icon="majesticons:plus-line" width="24" height="24" />
            </div>
            <div className="flex-1 h-[100%] flex items-center justify-start px-[0px] overflow-hidden">
              <p className="text-sm truncate">Create a community</p>
            </div>
          </Link>
          {redditCommunities.map((com, comIndex) => (
            <Link
              href={`/home/${com}`}
              key={comIndex}
              className="w-[100%] h-[40px] flex my-[5px]"
            >
              <div className="h-[100%] aspect-[1/1] border border-[#212121] rounded-full"></div>
              <div className="flex-1 h-[100%] flex items-center justify-start px-[10px] overflow-hidden">
                <p className="text-sm truncate">{com}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
