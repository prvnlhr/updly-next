"use client";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { uploadMediaAndCreatePost } from "@/services/user/postServices";
import BodyRichTextEditor from "./BodyRichTextEditor";
import { CommunityData } from "@/types/communityTypes";
import { useSession } from "next-auth/react";
import { searchCommunities } from "@/services/public/communityService";

const communityPlaceholder = "/communityPlaceholder.png";

const isFileList = (value: unknown): value is FileList => {
  return typeof window !== "undefined" && value instanceof FileList;
};

// Define separate schemas for each post type
const textPostSchema = z.object({
  type: z.literal("text"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

const imagePostSchema = z.object({
  type: z.literal("image"),
  title: z.string().min(1, "Title is required"),
  media: z
    .any()
    .refine((val) => isFileList(val) && val.length > 0, "Media is required")
    .refine(
      (files) => files[0]?.size <= 5 * 1024 * 1024,
      "Max file size is 5MB"
    ),
  content: z.string().optional(),
});

const linkPostSchema = z.object({
  type: z.literal("link"),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL").min(1, "URL is required"),
  content: z.string().optional(),
});

// Combined schema with discriminated union
const postSchema = z.discriminatedUnion("type", [
  textPostSchema,
  imagePostSchema,
  linkPostSchema,
]);

type FormValues = z.infer<typeof postSchema>;

interface CreatePostPageProps {
  communityDetails: CommunityData | null;
}

const defaultCommunity: CommunityData = {
  id: "",
  name: "",
  displayName: "all communities",
  description: null,
  iconUrl: communityPlaceholder,
  bannerUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: {
    members: 0,
    posts: 0,
  },
};

const CreatePostPage: React.FC<CreatePostPageProps> = ({
  communityDetails,
}) => {
  const searchParams = useSearchParams();
  const postType = searchParams.get("type") || "text";
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const user = session?.user;

  // Community selection states
  const [showCommunitySearch, setShowCommunitySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityData>(
    communityDetails || defaultCommunity
  );
  const [availableCommunities, setAvailableCommunities] = useState<
    CommunityData[]
  >([]);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      type: postType as "text" | "image" | "link",
      title: "",
      content: "",
      url: "",
    },
  });

  useEffect(() => {
    setSelectedCommunity(communityDetails || defaultCommunity);
  }, [communityDetails]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowCommunitySearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchCommunities = async (query: string) => {
    setIsLoadingCommunities(true);
    try {
      const results = await searchCommunities(query);
      return results.map((community) => ({
        id: community.id,
        name: community.name,
        displayName: community.displayName,
        description: community.description,
        iconUrl: community.iconUrl || communityPlaceholder,
        bannerUrl: community.bannerUrl,
        createdAt: new Date(community.createdAt),
        updatedAt: new Date(), // Add this if your mock had it
        _count: {
          members: community.memberCount,
          posts: community.postCount,
        },
      }));
    } catch (error) {
      console.error("Error fetching communities:", error);
      return [];
    } finally {
      setIsLoadingCommunities(false);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const results = await fetchCommunities(query);
      setAvailableCommunities(results);
    } else {
      setAvailableCommunities([]);
    }
  };

  const handleCommunitySelect = (community: CommunityData) => {
    setSelectedCommunity(community);
    setShowCommunitySearch(false);
    setSearchQuery("");
    setAvailableCommunities([]);
  };

  const toggleCommunitySearch = () => {
    setShowCommunitySearch(!showCommunitySearch);
    if (!showCommunitySearch) {
      setSearchQuery("");
      setAvailableCommunities([]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const communityId = selectedCommunity.id as string;
      const userId = user?.id;

      let postData: {
        title: string;
        type: "TEXT" | "IMAGE" | "VIDEO" | "LINK";
        communityId: string;
        userId: string;
        content?: string;
        media?: FileList;
        url?: string;
      } = {
        title: data.title,
        type: data.type.toUpperCase() as "TEXT" | "IMAGE" | "VIDEO" | "LINK",
        communityId,
        userId,
      };

      if (data.type === "text") {
        postData = {
          ...postData,
          content: data.content,
        };
      } else if (data.type === "image") {
        postData = {
          ...postData,
          content: data.content || "",
          media: data.media as FileList,
        };
      } else if (data.type === "link") {
        postData = {
          ...postData,
          content: data.content || "",
          url: data.url,
        };
      }
      await uploadMediaAndCreatePost(postData, communityId, userId);
      reset();
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];

      if (!file.type.match(/image\/*|video\/*/)) {
        setError("Only image or video files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setValue("media", files);
      await trigger("media");
    }
  };

  const hasMediaError = (
    errors: FieldErrors<FormValues>
  ): errors is FieldErrors<FormValues> & { media: { message: string } } => {
    return (
      "media" in errors &&
      !!errors.media &&
      typeof errors.media.message === "string"
    );
  };

  const hasContentError = (
    errors: FieldErrors<FormValues>
  ): errors is FieldErrors<FormValues> & { content: { message: string } } => {
    return (
      "content" in errors &&
      !!errors.content &&
      typeof errors.content.message === "string"
    );
  };

  const hasUrlError = (
    errors: FieldErrors<FormValues>
  ): errors is FieldErrors<FormValues> & { url: { message: string } } => {
    return (
      "url" in errors && !!errors.url && typeof errors.url.message === "string"
    );
  };

  return (
    <div className="w-[100%] h-[100%] p-[20px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[70%] h-[100%] flex flex-col overflow-x-scroll hide-scrollbar"
      >
        <div className="w-[100%] h-[50px] flex items-center">
          <p className="text-[1rem] font-medium">Create Post</p>
        </div>

        <div className="w-[100%] h-[calc(100%-50px)] flex flex-col">
          {/* Community selector */}
          <div
            className="w-[100%] h-[60px] min-h-[60px] flex items-center relative"
            ref={searchRef}
          >
            {showCommunitySearch ? (
              <div className="w-full max-w-[300px] relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search communities..."
                    className="w-full h-[40px] px-3 py-2 border border-[#212121] rounded-full focus:outline-none pl-10"
                    autoFocus
                  />
                  <Icon
                    icon="ion:search"
                    className="absolute left-3 text-gray-500 w-4 h-4"
                  />
                </div>

                {isLoadingCommunities && (
                  <div className="absolute top-[45px] left-0 w-full bg-white border border-[#212121] rounded-lg shadow-lg z-10 p-2">
                    <div className="flex justify-center items-center py-2">
                      <Icon icon="eos-icons:loading" className="w-6 h-6" />
                    </div>
                  </div>
                )}

                {!isLoadingCommunities && availableCommunities.length > 0 && (
                  <div className="absolute top-[45px] left-0 w-full bg-white border border-[#212121] rounded-lg shadow-lg z-10 max-h-[300px] overflow-y-auto">
                    {availableCommunities.map((community) => (
                      <div
                        key={community.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleCommunitySelect(community)}
                      >
                        <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
                          <Image
                            src={community.iconUrl || communityPlaceholder}
                            alt={community.displayName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            r/{community.displayName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {community._count.members} members
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isLoadingCommunities &&
                  searchQuery &&
                  availableCommunities.length === 0 && (
                    <div className="absolute top-[45px] left-0 w-full bg-white border border-[#212121] rounded-lg shadow-lg z-10 p-2">
                      <div className="text-center py-2 text-sm text-gray-500">
                        No communities found
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <button
                type="button"
                onClick={toggleCommunitySearch}
                className="w-auto h-[40px] flex items-center border border-[#212121] rounded-full hover:bg-gray-100 transition-colors px-3"
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
                  <Image
                    src={selectedCommunity.iconUrl as string}
                    alt={selectedCommunity.displayName}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-medium mr-2">
                  r/{selectedCommunity.displayName}
                </p>
                <Icon
                  icon="meteor-icons:chevron-down"
                  className="w-4 h-4 text-gray-500"
                />
              </button>
            )}
          </div>

          {/* Post type selector */}
          <div className="w-[100%] h-auto flex flex-col mt-[20px] my-[10px]">
            <div className="w-[100%] h-[60px] flex items-center">
              <Link
                href="?type=text"
                className={`w-[auto] h-[auto] flex items-center py-[5px] px-[5px] border-b-3 mx-[20px] ${
                  postType === "text"
                    ? "border-[#2E90FA]"
                    : "border-transparent"
                }`}
              >
                <p className="text-[0.9rem] font-medium">Text</p>
              </Link>
              <Link
                href="?type=image"
                className={`w-[auto] h-[auto] flex items-center py-[5px] px-[5px] border-b-3 mx-[20px] ${
                  postType === "image"
                    ? "border-[#2E90FA]"
                    : "border-transparent"
                }`}
              >
                <p className="text-[0.9rem] font-medium">Images & Video</p>
              </Link>
              <Link
                href="?type=link"
                className={`w-[auto] h-[auto] flex items-center py-[5px] px-[5px] border-b-3 mx-[20px] ${
                  postType === "link"
                    ? "border-[#2E90FA]"
                    : "border-transparent"
                }`}
              >
                <p className="text-[0.9rem] font-medium">Link</p>
              </Link>
            </div>
          </div>

          {/* Form content */}
          <div className="w-[100%] h-[auto] border-[#212121] p-[5px]">
            {/* Title field (required for all types) */}
            <div className="w-[100%] h-[100px] px-[0px] my-[20px]">
              <input
                {...register("title")}
                className="w-[100%] h-[calc(100%-30px)] border border-[#212121] px-[20px] rounded-[20px]"
                placeholder="Title *"
              />
              <div className="w-[100%] h-[30px] flex items-center px-[10px]">
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>
            </div>

            {/* Image/Video Upload (only for image type) */}
            {postType === "image" && (
              <div className="w-[100%] h-auto my-[20px]">
                <div className="relative w-[100%] h-[200px] border border-[#212121] rounded-[20px] flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <Image
                      fill={true}
                      src={preview}
                      alt="Preview"
                      className="max-h-full max-w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-[0.9rem] text-gray-500">
                        Drag and drop or click to upload
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="media-upload"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="media-upload"
                  className="block mt-[10px] text-[0.9rem] text-blue-500 cursor-pointer"
                >
                  Upload Media *
                </label>
                {hasMediaError(errors) && (
                  <p className="text-xs text-red-500">{errors.media.message}</p>
                )}
              </div>
            )}

            {/* URL Input (only for link type) */}
            {postType === "link" && (
              <div className="w-[100%] h-[100px] my-[10px]">
                <input
                  {...register("url")}
                  className="w-[100%] h-[calc(100%-30px)] rounded-[20px] px-[20px] border border-[#212121]"
                  placeholder="URL *"
                />
                <div className="w-[100%] h-[30px] flex items-center px-[10px]">
                  {hasUrlError(errors) && (
                    <p className="text-xs text-red-500">{errors.url.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Rich Text Editor (shown for all types but required differently) */}
            <div className="w-[100%] h-[auto] flex flex-col p-[0px] mt-[20px]">
              <BodyRichTextEditor
                onChange={(html: string) => setValue("content", html)}
                value={watch("content") || ""}
              />
              <div className="w-[100%] h-[30px] flex items-center px-[10px]">
                {hasContentError(errors) && (
                  <p className="text-xs text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </div>

            {/* Error message and submit button */}
            {error && (
              <div className="w-[100%] h-[30px] flex items-center px-[10px]">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}

            <div className="w-[100%] h-[60px] flex items-center justify-end mt-[20px]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[120px] h-[40px] bg-blue-500 text-white rounded-full flex items-center justify-center"
              >
                {isSubmitting ? "Creating..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
