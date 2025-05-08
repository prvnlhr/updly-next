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
    <div className="w-[20%] h-full border-r flex items-center justify-center p-[10px]">
      <div className="w-[80%] h-[90%] flex flex-col overflow-y-scroll hide-scrollbar">
        {/* RECENT VISITED */}
        <div className="w-[100%] h-[auto] flex flex-col border-b py-[20px]">
          <div className="w-[100%] h-[50px] flex items-center">
            <p className="text-sm text-[#A2A8B2]">RECENT</p>
          </div>
          {recentVisited.map((com, comIndex) => (
            <div key={comIndex} className="w-[100%] h-[40px] flex my-[5px]">
              <div className="h-[100%] aspect-[1/1] border rounded-full"></div>
              <div className="flex-1 h-[100%] flex items-center justify-start px-[10px] overflow-hidden">
                <p className="text-sm truncate">{com}</p>
              </div>
            </div>
          ))}
        </div>
        {/* COMMUNTIIES GROUP */}
        <div className="w-[100%] h-[auto] flex flex-col border-b py-[20px]">
          <div className="w-[100%] h-[50px] flex items-center">
            <p className="text-sm text-[#A2A8B2]">COMMUNITIES</p>
          </div>
          {redditCommunities.map((com, comIndex) => (
            <div key={comIndex} className="w-[100%] h-[40px] flex my-[5px]">
              <div className="h-[100%] aspect-[1/1] border rounded-full"></div>
              <div className="flex-1 h-[100%] flex items-center justify-start px-[10px] overflow-hidden">
                <p className="text-sm truncate">{com}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
