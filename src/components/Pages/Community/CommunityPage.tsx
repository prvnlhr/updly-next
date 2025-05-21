"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CommunityDetails } from "@/types/communityTypes";
import parse from "html-react-parser";
import Link from "next/link";
import { votePost } from "@/services/user/postServices";
import { useSession } from "next-auth/react";
import { formatDate } from "@/utils/dateFormat";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import { toggleCommunityMembership } from "@/services/user/communityServices";
import { FeedPost } from "@/types/feedTypes";

interface CommunityPageProps {
  communityDetails: CommunityDetails;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ communityDetails }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const { community } = communityDetails;
  const [posts, setPosts] = useState(communityDetails.posts);
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(community.isMember || false);

  const handleJoinToggle = async () => {
    if (!user?.id || isJoining) return;

    setIsJoining(true);
    try {
      const { isMember: newStatus } = await toggleCommunityMembership(
        user.id,
        community.id as string
      );
      setIsMember(newStatus);
    } catch (error) {
      console.error("Failed to toggle community membership:", error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleVote = async (postId: string, voteType: "up" | "down") => {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
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

  const date = formatDate(community.createdAt);
  const isOwner = user?.id === community.ownerId;

  return (
    <div className="w-full h-full overflow-y-scroll hide-scrollbar p-[20px]">
      {/* Banner and Logo Section */}
      <div className="relative w-full h-[200px] min-h-[200px] flex flex-col justify-end rounded-[20px] z-1 mb-[20px]">
        <div className="absolute top-0 left-0 w-full h-[140px] rounded-[20px] z-2 overflow-hidden border border-[#212121]">
          <Image
            src={community.bannerUrl as string}
            fill={true}
            className="object-cover"
            alt="c_banner"
          />
        </div>
        <div className="w-full h-[50%] flex items-end px-[10px] z-3">
          <div className="relative h-[100%] aspect-square border border-[#212121] rounded-full overflow-hidden">
            <Image
              src={community.iconUrl as string}
              fill={true}
              className="object-cover"
              alt="c_logo"
            />
          </div>
          <div className="flex-1 h-[50px] flex items-center px-[20px]">
            <p className="text-[2rem] font-medium">{community.displayName}</p>

            <div className="w-auto h-[100%] flex items-center ml-auto">
              {!isOwner && user && (
                <button
                  onClick={handleJoinToggle}
                  disabled={isJoining}
                  className={`h-[60%] mr-[10px] px-4 flex items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer
                  ${
                    isMember
                      ? "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500/10"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }
                  ${isJoining ? "opacity-70 cursor-not-allowed" : ""}
                `}
                >
                  {isJoining ? (
                    <div className="h-[15px] w-[15px] flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : isMember ? (
                    "Joined"
                  ) : (
                    "Join"
                  )}
                </button>
              )}

              <Link
                href={`${`/home/${community.displayName}/submit`}`}
                className="w-[auto] h-[40px] flex items-center border rounded-full px-[10px]"
              >
                <Icon
                  icon="ic:round-plus"
                  className="text-[1.2rem] text-gray-400 mr-[5px]"
                />
                <p className="text-sm text-gray-400">Create Post</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex">
        {/* Left Section - Posts (Scrollable) */}
        <section className="w-[70%] pr-5">
          {posts.map((post) => {
            const isOwnPost = user?.id === post.author.id;

            return (
              <div
                key={post.id}
                className="w-full h-auto border border-[#212121] mb-5 rounded-[30px] p-[10px]"
              >
                {/* Post content */}
                <div className="w-full h-auto flex flex-col">
                  {/* Post header */}
                  <div className="w-full h-[40px] flex">
                    <div className="h-full aspect-square border border-[#212121] rounded-full bg-gray-300/10"></div>
                    <div className="h-full flex-1 flex items-center px-[10px]">
                      <p className="text-xs">u/{post.author.username}</p>
                      <Icon
                        icon="bi:dot"
                        className="w-[16px] h-[16px] text-[#A2A8B2]"
                      />
                      <p className="text-xs text-[#A2A2A2]">
                        {formatDate(post.createdAt).formattedDate}
                      </p>
                    </div>
                  </div>

                  {/* Post content body */}
                  <div className="w-full h-auto px-[10px]">
                    {post.title && (
                      <div className="w-full h-auto py-[5px]">
                        <p className="text-[1.2rem] font-medium">
                          {post.title}
                        </p>
                      </div>
                    )}

                    <div className="w-full h-auto py-[10px]">
                      {post.mediaUrl &&
                        (post.type === "IMAGE" || post.type === "VIDEO") && (
                          <div className="relative w-full h-auto aspect-video rounded-[20px] overflow-hidden mb-3">
                            {post.type === "IMAGE" ? (
                              <Image
                                src={post.mediaUrl}
                                alt={`${post.title || "Post"} image`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            ) : (
                              <video
                                src={post.mediaUrl}
                                controls
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        )}

                      {post.url && post.type === "LINK" && (
                        <div className="flex flex-col space-y-2 mb-3">
                          <Link
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all"
                          >
                            {post.url}
                          </Link>
                        </div>
                      )}

                      {post.content && (
                        <div className="prose max-w-none text-sm">
                          {parse(post.content)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post footer (upvotes/comments) */}
                  <div className="w-full h-[40px] flex items-center">
                    <div className="w-auto h-[90%] flex items-center rounded-full bg-gray-300/10">
                      <button
                        onClick={() => handleVote(post.id, "up")}
                        disabled={isOwnPost || !user}
                        className={getVoteButtonClass(post, "up")}
                        title={
                          isOwnPost
                            ? "Can't vote on your own post"
                            : !user
                            ? "Login to vote"
                            : "Upvote"
                        }
                      >
                        <Icon icon="bx:upvote" className="w-[15px] h-[15px]" />
                      </button>
                      <div
                        className={`h-full w-auto px-[5px] text-xs flex items-center justify-center ${
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
                        disabled={isOwnPost || !user}
                        className={getVoteButtonClass(post, "down")}
                        title={
                          isOwnPost
                            ? "Can't vote on your own post"
                            : !user
                            ? "Login to vote"
                            : "Downvote"
                        }
                      >
                        <Icon
                          icon="bx:downvote"
                          className="w-[15px] h-[15px]"
                        />
                      </button>
                    </div>
                    <div className="w-auto h-[90%] flex items-center rounded-full bg-gray-300/10 ml-[10px]">
                      <div className="h-full aspect-square flex items-center hover:bg-gray-300/10 rounded-full justify-center">
                        <Icon
                          icon="uil:comment"
                          className="w-[15px] h-[15px]"
                        />
                      </div>
                      <div className="h-full w-auto text-xs flex items-center justify-start pr-[20px]">
                        {post.commentCount || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Right Section - Community Info (Sticky and Scrollable) */}
        <section className="w-[30%] sticky top-0 h-screen overflow-y-auto hide-scrollbar">
          <div className="flex flex-col p-5 rounded-lg bg-[#010101] border border-[#212121]">
            {/* Community Header */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-white">
                r/{community.name}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {community.description}
              </p>
              <div className="flex items-center mt-2 text-gray-400">
                <Icon icon="hugeicons:time-03" className="text-sm mr-1" />
                <span className="text-xs">Created {date.formattedDate}</span>
              </div>
            </div>

            {/* Posting Requirements */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">
                Posting Requirements
              </h2>
              <ul className="text-sm text-gray-300 space-y-2 pl-5 list-disc">
                <li>A Reddit account at least 1 day old</li>
                <li>A verified email address</li>
                <li>
                  At least 5 Post karma to post (Post and Comment karma are
                  different)
                </li>
                <li>
                  You can only make 2 posts in 24 hours. Removed and deleted
                  posts count towards the limit
                </li>
              </ul>
            </div>

            {/* Rules Section */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Rules</h2>
              <div className="space-y-4">
                {/* Rule 1 */}
                <div className="bg-[#0a0a0a] p-3 rounded-lg">
                  <h3 className="font-medium text-white mb-1">
                    1. Relevance/Off-Topic/No Political Discussions
                  </h3>
                  <p className="text-sm text-gray-300">
                    All submissions and discussions should be about GTA6 or GTA6
                    Online only. Off-topic posts and discussions will be
                    removed.
                    <br />
                    <br />
                    No political or controversial real-life persons discussions
                    or posts are allowed at all.
                  </p>
                </div>

                {/* Rule 2 */}
                <div className="bg-[#0a0a0a] p-3 rounded-lg">
                  <h3 className="font-medium text-white mb-1">
                    2. Be Respectful
                  </h3>
                  <p className="text-sm text-gray-300">
                    Absolutely no hate-speech, racism, or homophobic/transphobic
                    comments are allowed. This is a zero tolerance policy that
                    will be strictly enforced and the user banned. In addition,
                    disrespectful comments to, or harassing of other users here
                    will result in a ban from this community. This includes
                    displaying anyone&apos;s personal or confidential
                    information or stalking.
                  </p>
                </div>

                {/* Rule 3 */}
                <div className="bg-[#0a0a0a] p-3 rounded-lg">
                  <h3 className="font-medium text-white mb-1">3. Spoilers</h3>
                  <p className="text-sm text-gray-300">
                    All posts containing spoilers MUST have the spoiler tag
                    applied to it and the post title must also be spoiler free.
                    Intentionally posting spoilers in comments will result in
                    the user being muted or banned.
                  </p>
                </div>

                {/* Additional rules... */}
                <div className="text-center pt-2">
                  <button className="text-xs text-blue-500 hover:underline">
                    Show all rules (6 more)
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-[#212121]">
              <div className="flex justify-between text-xs text-gray-400">
                <span>© 2025 r/{community.name}</span>
                <span>{community._count.members} members</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CommunityPage;
