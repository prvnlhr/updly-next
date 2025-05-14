"use client";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import BodyRichTextEditor from "./BodyRichTextEditor";
import Image from "next/image";
import { uploadMediaAndCreatePost } from "@/services/postServices";

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
    .unknown()
    .refine((val) => isFileList(val) && val.length > 0, "Media is required")
    .refine((val) => {
      if (!isFileList(val)) return false;
      const file = val[0];
      return file.type.startsWith("image/") || file.type.startsWith("video/");
    }, "Only images and videos are allowed"),
  content: z.string().optional(),
});

const linkPostSchema = z.object({
  type: z.literal("link"),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL").min(1, "URL is required"),
});

// Combined schema with discriminated union
const postSchema = z.discriminatedUnion("type", [
  textPostSchema,
  imagePostSchema,
  linkPostSchema,
]);

type FormValues = z.infer<typeof postSchema>;

const CreatePostPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postType = searchParams.get("type") || "text";
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      type: postType as "text" | "image" | "link",
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const communityId = "8e99d5e8-0316-48e9-97ce-d9e41b581dbb";
      const userId = "85d88c8a-e929-41d1-af44-795bdd5c7167";

      await uploadMediaAndCreatePost(
        {
          title: data.title,
          content: data.type === "link" ? "" : data.content || "",
          media: data.type === "image" ? data.media : undefined,
          url: data.type === "link" ? data.url : undefined,
        },
        communityId,
        userId
      );

      reset();
      router.push(`/r/${communityId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue("media", files);
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
          <div className="w-[100%] h-[60px] min-h-[60px] flex items-center">
            <div className="w-auto h-[80%] flex border border-[#212121] rounded-full">
              <div className="h-[100%] aspect-square flex items-center justify-center">
                <div className="w-[80%] h-[80%] border border-[#212121] rounded-full"></div>
              </div>
              <div className="w-auto h-[100%] flex items-center justify-center px-[5px]">
                <p className="text-[0.7rem] font-medium">r/GTA 6</p>
              </div>
              <div className="h-[100%] w-auto flex items-center justify-center mx-[10px]">
                <Icon
                  icon="meteor-icons:chevron-down"
                  className="w-[15px] h-[15px]"
                />
              </div>
            </div>
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
            {/* Title field */}
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

            {/* Conditional fields based on post type */}
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
                  Upload Media
                </label>
                {hasMediaError(errors) && (
                  <p className="text-xs text-red-500">{errors.media.message}</p>
                )}
              </div>
            )}

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

            {/* Rich text editor */}
            {(postType === "text" || postType === "image") && (
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
            )}

            {/* Error message */}
            {error && (
              <div className="w-[100%] h-[30px] flex items-center px-[10px]">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}

            {/* Submit button */}
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
