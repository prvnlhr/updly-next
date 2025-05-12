import React from "react";
import bannerImg from "../../../../../public/community_banner.png";
import communityLogo from "../../../../../public/c_logo.png";
import Image from "next/image";
import { redditPosts } from "@/utils/sampleData";
import { Icon } from "@iconify/react/dist/iconify.js";
const page = () => {
  return (
    <div className="w-[100%] h-[100%] p-[10px] flex flex-col overflow-y-scroll hide-scrollbar">
      <div className="relative w-[100%] h-[200px] min-h-[200px] flex flex-col justify-end rounded-[20px] z-1 mb-[20px]">
        <div className="absolute top-0 left-0 w-[100%] h-[140px] rounded-[20px] z-2 overflow-hidden">
          <Image
            src={bannerImg}
            fill={true}
            className="object-cover"
            alt="c_banner"
          />
        </div>
        <div className="w-[100%] h-[50%] flex items-end px-[10px] z-3">
          <div className="relative h-[100%] aspect-square border border-[#212121] rounded-full overflow-hidden">
            <Image
              src={communityLogo}
              fill={true}
              className="object-contain"
              alt="c_logo"
            />
          </div>
          <div className="flex-1 h-[50px] flex items-end px-[20px]">
            <p className="text-[2rem] font-medium">r/GTA 6</p>
          </div>
        </div>
      </div>
      <div className="w-[100%] h-[auto] flex flex-col">
        {redditPosts.map((post, pId) => (
          <div
            key={pId}
            className="w-[100%] h-[auto] border border-[#212121] mt-[30px] rounded-[30px] p-[10px]"
          >
            <div className="w-[100%] h-[auto] flex flex-col">
              <div className="w-[100%] h-[40px] flex">
                <div className="h-[100%] aspect-square border border-[#212121] rounded-full"></div>
                <div className="h-[100%] flex-1 flex items-center px-[10px]">
                  <p className="text-xs">{post.community}</p>
                  <Icon
                    icon="bi:dot"
                    className="w-[16px] h-[16px] text-[#A2A8B2]"
                  />
                  <p className="text-xs text-[#A2A8B2]">{post.timestamp}</p>
                </div>
              </div>
              <div className="w-[100%] h-[auto] px-[10px]">
                <div className="w-[100%] h-[auto] py-[5px]">
                  <p className="text-[1.2rem] font-medium">{post.title}</p>
                </div>
                <div className="w-[100%] h-[auto] py-[10px]">
                  {post.isImage ? (
                    <div className="relative w-full h-auto aspect-video rounded-[20px] overflow-hidden">
                      <Image
                        src={post.content}
                        alt={`${post.title} image`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-[#A2A8B2] leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-[100%] h-[40px] flex items-center">
                <div className="w-[auto] h-[90%] flex items-center rounded-full bg-gray-300/10">
                  <div className="h-[100%] aspect-square flex items-center hover:bg-gray-300/10 rounded-full justify-center">
                    <Icon icon="bx:upvote" className="w-[15px] h-[15px]" />
                  </div>
                  <div className="h-[100%] w-[auto] px-[5px] text-xs flex items-center justify-center">
                    {post.upvotes || 0}
                  </div>
                  <div className="h-[100%] aspect-square flex items-center hover:bg-gray-300/10 rounded-full justify-center">
                    <Icon icon="bx:downvote" className="w-[15px] h-[15px]" />
                  </div>
                </div>
                <div className="w-[auto] h-[90%] flex items-center rounded-full bg-gray-300/10 ml-[10px]">
                  <div className="h-[100%] aspect-square flex items-center hover:bg-gray-300/10 rounded-full justify-center">
                    <Icon icon="uil:comment" className="w-[15px] h-[15px]" />
                  </div>
                  <div className="h-[100%] w-auto text-xs flex items-center justify-start pr-[20px]">
                    {post.comments || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
