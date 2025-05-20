import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
// import { redditPosts } from "@/utils/sampleData";
import { FeedPost } from "@/types/feedTypes";
import parse from "html-react-parser";

// const samplePosts = [
//   {
//     community: "r/ProgrammerHumor",
//     title: "When you finally fix the bug after 6 hours",
//     desc: "Me: 'I should document this solution'... Also me: closes IDE immediately",
//     imageUrl:
//       "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     community: "r/AskReddit",
//     title: "What's the most useless talent you have?",
//     desc: "I can identify most brands of bottled water by taste",
//     imageUrl:
//       "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     community: "r/Technology",
//     title: "New AI can generate 3D models from text descriptions",
//     desc: "Researchers demonstrate 'Prompt-to-3D' system with 90% accuracy",
//     imageUrl:
//       "https://images.unsplash.com/photo-1677442135136-760c813cd871?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     community: "r/Gaming",
//     title: "GTA 6 trailer breaks record",
//     desc: "Contains never-before-seen developer notes",
//     imageUrl:
//       "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     community: "r/Movies",
//     title: "Christopher Nolan's next film reportedly about AI ethics",
//     desc: "Shooting begins 2024 with Tom Cruise in talks to star",
//     imageUrl:
//       "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     community: "r/Showerthoughts",
//     title: "USB cables are the modern equivalent of 'this end toward enemy'",
//     desc: "No matter how you look at it, the first try is always wrong",
//     imageUrl:
//       "https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     community: "r/NatureIsFuckingLit",
//     title: "This bioluminescent mushroom I found in the forest",
//     desc: "Nature's own night light",
//     imageUrl:
//       "https://images.unsplash.com/photo-1604977048617-3ab9a84f8de0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     community: "r/FoodPorn",
//     title: "Homemade ramen that took me 12 hours to make",
//     desc: "Worth every minute",
//     imageUrl:
//       "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     community: "r/space",
//     title: "James Webb Telescope's latest image of the Carina Nebula",
//     desc: "The cosmic cliffs have never looked more stunning",
//     imageUrl:
//       "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     community: "r/Art",
//     title: "My oil painting of the city skyline at golden hour",
//     desc: "30 hours of work condensed into one moment",
//     imageUrl:
//       "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//   },
// ];

interface MainFeedProps {
  feeds: FeedPost[];
}
const MainFeed: React.FC<MainFeedProps> = ({ feeds }) => {
  return (
    <div className="flex-1 h-full border-r border-[#212121] p-2 overflow-hidden">
      <div className="w-full h-full overflow-y-scroll hide-scrollbar px-[10px]">
        <div className="w-[100%] max-w-[100%] h-[250px] flex overflow-x-scroll whitespace-nowrap hide-scrollbar space-x-[20px] my-[20px] min-w-0">
          {feeds.map((post, i) => (
            <div
              key={i}
              className="relative h-full aspect-square flex flex-col justify-end flex-shrink-0 rounded-[30px] overflow-hidden border border-[#E4E5E8]/10"
            >
              {/* post image */}
              <div className="absolute w-[100%] h-[100%]">
                {post.mediaUrl && (
                  <Image
                    src={post.mediaUrl as string}
                    fill={true}
                    alt="post-img"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_40%,rgba(0,0,0,0.9)_70%,rgba(0,0,0,1)_100%)]" />
              </div>
              {/* title */}
              <div className="w-[100%] h-[auto] flex items-center px-[10px] z-[3]">
                <p className="text-[1.5rem] text-[#e0e5eb] font-medium truncate">
                  {post.title}
                </p>
              </div>
              {/* Description */}
              <div className="w-full h-[70px] flex items-start p-[15px] z-[3] overflow-hidden">
                <div className="w-full h-full overflow-hidden line-clamp-1">
                  {post.content && parse(post.content)}
                </div>
              </div>
              <div className="w-[100%] h-[60px] flex items-center px-[5px] py-[5px] z-[3]">
                <div className="h-[100%] aspect-square rounded-full border border-white/10"></div>
                <div className="flex-1 h-[100%] flex items-center px-[10px]">
                  <p className="text-[0.75rem] text-[#e0e5eb] font-medium">
                    {post.community.displayName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vertical feed section with proper image handling */}
        {feeds.map((post, pId) => (
          <div
            key={pId}
            className="w-[100%] h-[auto] border border-[#212121] mt-[30px] rounded-[30px] p-[10px]"
          >
            <div className="w-[100%] h-[auto] flex flex-col">
              <div className="w-[100%] h-[40px] flex">
                <div className="h-[100%] aspect-square border border-[#212121] rounded-full"></div>
                <div className="h-[100%] flex-1 flex items-center px-[10px]">
                  <p className="text-xs">{post.community.displayName}</p>
                  <Icon
                    icon="bi:dot"
                    className="w-[16px] h-[16px] text-[#A2A8B2]"
                  />
                  <p className="text-xs text-[#A2A8B2]">
                    {/* {post.createdAt.getTime()} */}
                  </p>
                </div>
              </div>
              <div className="w-[100%] h-[auto] px-[10px]">
                <div className="w-[100%] h-[auto] py-[5px]">
                  <p className="text-[1.2rem] font-medium">{post.title}</p>
                </div>
                <div className="w-[100%] h-[auto] py-[10px]">
                  {post?.mediaUrl ? (
                    <div className="relative w-full h-auto aspect-video rounded-[20px] overflow-hidden">
                      <Image
                        src={post.mediaUrl as string}
                        alt={`${post.title} image`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="line-clamp-[10]">

                      <>{post.content && parse(post.content)}</>
                    </div>
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
                    {post.commentCount || 0}
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

export default MainFeed;
