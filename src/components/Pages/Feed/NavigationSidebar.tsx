"use client";
import { useModal } from "@/context/ModalContext";
import { UserCommunitiesResponse } from "@/types/communityTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";

interface NavigationSidebarProps {
  sidebarData: UserCommunitiesResponse;
}
const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  sidebarData,
}) => {
  const { data: session } = useSession();
  const user = session?.user;
  const { createdCommunities, joinedCommunities } = sidebarData;
  const router = useRouter();
  const { openAuthModal } = useModal();

  const handleCreateCommunity = () => {
    const userId = user?.id;
    if (!userId) {
      openAuthModal();
      return;
    }
    router.push(`?create-community=true`);
  };
  return (
    <div className="w-[20%] h-full border-r border-[#212121] flex items-center justify-center p-[10px]">
      <div className="w-[80%] h-[90%] flex flex-col overflow-y-scroll hide-scrollbar">
        {/* RECENT VISITED */}

        <div className="w-[100%] h-[auto] flex flex-col border-b border-[#212121] py-[20px]">
          <div className="w-[100%] h-[50px] flex items-center">
            <p className="text-sm text-[#A2A8B2]">MODERATION</p>
          </div>

          {createdCommunities.map((createdCommunity, comIndex) => (
            <Link
              href={`/home/${createdCommunity.displayName}`}
              key={comIndex}
              className="w-[100%] h-[40px] flex my-[5px]"
            >
              <div className="relative h-[100%] aspect-[1/1] border border-[#212121] rounded-full overflow-hidden">
                <Image
                  src={createdCommunity.iconUrl as string}
                  fill={true}
                  alt={createdCommunity.id}
                />
              </div>
              <div className="flex-1 h-[100%] flex items-center justify-start px-[10px] overflow-hidden">
                <p className="text-sm truncate">
                  {createdCommunity.displayName}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {/* COMMUNTIIES GROUP */}
        <div className="w-[100%] h-[auto] flex flex-col border-b border-[#212121] py-[20px]">
          <div className="w-[100%] h-[50px] flex items-center">
            <p className="text-sm text-[#A2A8B2]">COMMUNITIES</p>
          </div>
          <button
            onClick={handleCreateCommunity}
            className="w-[100%] h-[40px] flex my-[5px] cursor-pointer"
          >
            <div className="h-[100%] aspect-[1/1] flex items-center justify-center border-[#212121] rounded-full">
              <Icon icon="majesticons:plus-line" width="24" height="24" />
            </div>
            <div className="flex-1 h-[100%] flex items-center justify-start px-[0px] overflow-hidden">
              <p className="text-sm truncate">Create a community</p>
            </div>
          </button>
          {joinedCommunities.map((joinedCommunity, comIndex) => (
            <Link
              href={`/home/${joinedCommunity.displayName}`}
              key={comIndex}
              className="w-[100%] h-[40px] flex my-[5px]"
            >
              <div className="relative h-[100%] aspect-[1/1] border border-[#212121] rounded-full overflow-hidden">
                <Image
                  src={joinedCommunity.iconUrl as string}
                  fill={true}
                  alt={joinedCommunity.id}
                />
              </div>
              <div className="flex-1 h-[100%] flex items-center justify-start px-[10px] overflow-hidden">
                <p className="text-sm truncate">{joinedCommunity.iconUrl}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
