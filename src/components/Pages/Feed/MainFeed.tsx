"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { FeedPost } from "@/types/feedTypes";
import parse from "html-react-parser";
import { formatDate } from "@/utils/dateFormat";
import { votePost } from "@/services/user/postServices";
import { useSession } from "next-auth/react";

interface MainFeedProps {
  feeds: FeedPost[];
}

const MainFeed: React.FC<MainFeedProps> = ({ feeds }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const [posts, setPosts] = useState<FeedPost[]>(feeds);

  const handleVote = async (postId: string, voteType: "up" | "down") => {
    if (!user?.id) return;

    const originalPosts = [...posts];

    // Optimistic update
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        let newVoteStatus: boolean | null;
        let scoreChange = 0;

        if (post.userVote === null) {
          // New vote
          newVoteStatus = voteType === "up";
          scoreChange = voteType === "up" ? 1 : -1;
        } else if (
          (voteType === "up" && post.userVote) ||
          (voteType === "down" && !post.userVote)
        ) {
          // Removing vote
          newVoteStatus = null;
          scoreChange = post.userVote ? -1 : 1;
        } else {
          // Changing vote
          newVoteStatus = voteType === "up";
          scoreChange = voteType === "up" ? 2 : -2;
        }

        return {
          ...post,
          userVote: newVoteStatus,
          upvotes: post.upvotes + scoreChange,
        };
      })
    );

    try {
      const result = await votePost({
        postId,
        userId: user.id,
        voteType,
      });

      if (result.status !== "success") {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error("Vote failed:", error);
      // Revert on error
      setPosts(originalPosts);
    }
  };

  const getVoteButtonClass = (post: FeedPost, direction: "up" | "down") => {
    const baseClass =
      "h-[100%] aspect-square flex items-center rounded-full justify-center";
    const activeClass =
      direction === "up"
        ? "text-orange-500 hover:bg-orange-500/10"
        : "text-blue-500 hover:bg-blue-500/10";
    const inactiveClass = "text-gray-500 hover:bg-gray-300/20";

    if (post.userVote === null) {
      return `${baseClass} ${inactiveClass}`;
    }

    if (
      (direction === "up" && post.userVote) ||
      (direction === "down" && !post.userVote)
    ) {
      return `${baseClass} ${activeClass}`;
    }

    return `${baseClass} ${inactiveClass}`;
  };

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
                <div className="h-[100%] aspect-square flex items-center justify-center border border-[#363636] rounded-full">
                  {post.author.username[0]}
                </div>
                <div className="h-[100%] flex-1 flex items-center px-[10px]">
                  <p className="text-xs">
                    {post.community.displayName} {post.userVote}
                  </p>
                  <Icon
                    icon="bi:dot"
                    className="w-[16px] h-[16px] text-[#A2A8B2]"
                  />
                  <p className="text-xs text-[#A2A8B2]">
                    {formatDate(post.createdAt).formattedDate}
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
                  <button
                    onClick={() => handleVote(post.id, "up")}
                    disabled={!user}
                    className={getVoteButtonClass(post, "up")}
                    title={!user ? "Login to vote" : "Upvote"}
                  >
                    <Icon icon="bx:upvote" className="w-[15px] h-[15px]" />
                  </button>
                  <div
                    className={`h-[100%] w-[auto] px-[5px] text-xs flex items-center justify-center ${
                      post.userVote === true
                        ? "text-orange-500"
                        : post.userVote === false
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {post.upvotes}
                  </div>
                  <button
                    onClick={() => handleVote(post.id, "down")}
                    disabled={!user}
                    className={getVoteButtonClass(post, "down")}
                    title={!user ? "Login to vote" : "Downvote"}
                  >
                    <Icon icon="bx:downvote" className="w-[15px] h-[15px]" />
                  </button>
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
