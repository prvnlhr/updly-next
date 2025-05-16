import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { searchContent } from "@/services/searchServices";
import { CommunityPreview, PostPreview } from "@/types/searchTypes";
import { Oval } from "react-loader-spinner";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    communities: CommunityPreview[];
    posts: PostPreview[];
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchContent(searchQuery);
          setSearchResults(results);
          setIsDropdownOpen(true);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
        setIsDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setIsDropdownOpen(false);
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="md:w-[60%] h-[100%] flex items-center" ref={searchRef}>
      <div className="relative w-[80%] h-[70%] flex rounded-full border border-[#212121]">
        <div className="flex-1 h-[100%] flex items-center justify-center">
          <input
            className="w-[100%] h-[100%] px-[20px] placeholder:text-sm bg-transparent outline-none"
            placeholder="Search Community, Post..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === "") {
                setIsDropdownOpen(false);
              }
            }}
            onFocus={() => searchQuery.length >= 2 && setIsDropdownOpen(true)}
          />
        </div>

        {/* Right side button */}
        <button
          className="h-[100%] aspect-square flex items-center justify-center rounded-full"
          onClick={searchQuery ? clearSearch : undefined}
        >
          {isSearching ? (
            <div className="w-[80%] h-[80%] flex items-center justify-center">
              <Oval
                visible={true}
                color="white"
                secondaryColor="transparent"
                strokeWidth="3"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass="w-[18px] h-[18px] flex items-center justify-center"
              />
            </div>
          ) : searchQuery ? (
            <Icon
              icon="material-symbols:close"
              className="w-[20px] h-[20px] cursor-pointer"
            />
          ) : (
            <Icon
              icon="iconamoon:search"
              className="w-[20px] h-[20px] cursor-pointer"
            />
          )}
        </button>

        {/* Results dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-[45px] w-[100%] h-[auto] flex flex-col rounded min-h-[100px] bg-[#161617] z-10 p-[20px] overflow-y-scroll hide-scrollbar max-h-[400px]">
            {/* Communities Section */}
            {searchResults?.communities &&
              searchResults.communities.length > 0 && (
                <div className="w-[100%] h-[auto] flex flex-col mb-4">
                  <div className="w-[100%] h-[40px] flex items-center">
                    <p className="text-sm">Communities</p>
                  </div>
                  <div className="w-[100%] h-[auto] flex flex-col">
                    {searchResults.communities.map((community) => (
                      <div
                        key={community.id}
                        className="w-[100%] h-[60px] flex my-[10px] hover:bg-[#212121] rounded p-[10px] cursor-pointer"
                      >
                        <div className="relative h-[100%] aspect-square border rounded-full overflow-hidden">
                          {community.iconUrl && (
                            <Image
                              src={community.iconUrl}
                              alt={community.displayName}
                              fill={true}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 h-[100%] flex flex-col px-[10px]">
                          <p className="text-[1rem]">
                            r/{community.name.split("/")[1]}
                          </p>
                          <p className="text-[0.7rem] font-secondary">
                            {community.memberCount.toLocaleString()} members
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Posts Section */}
            {searchResults?.posts && searchResults.posts.length > 0 && (
              <div className="w-[100%] h-[auto] flex flex-col">
                <div className="w-[100%] h-[40px] flex items-center">
                  <p className="text-sm">Posts</p>
                </div>
                <div className="w-[100%] h-[auto] flex flex-col">
                  {searchResults.posts.map((post) => (
                    <div
                      key={post.id}
                      className="w-[100%] h-[60px] flex my-[5px] hover:bg-[#212121] rounded p-[10px] cursor-pointer"
                    >
                      <div className="w-[100%] h-[100%] flex flex-col px-[10px]">
                        <p className="text-[1rem]">{post.title}</p>
                        <p className="text-[0.7rem] font-secondary">
                          r/{post.community.displayName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults &&
              searchResults.communities.length === 0 &&
              searchResults.posts.length === 0 && (
                <div className="w-[100%] h-[40px] flex items-center justify-center">
                  <p className="text-sm text-gray-400">No results found</p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
