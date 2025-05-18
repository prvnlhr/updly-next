"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { createCommunity } from "@/services/user/communityServices";
import Image from "next/image";
import { useSession } from "next-auth/react";

// Zod schema for form validation
const communitySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500),
  icon: z.instanceof(File).optional(),
  banner: z.instanceof(File).optional(),
  topics: z.array(z.string()).min(1, "Select at least one topic"),
});

type CommunityFormData = z.infer<typeof communitySchema>;

// Category and topic data
const categories = [
  {
    name: "Music",
    topics: [
      "Pop",
      "Rock",
      "Hip Hop",
      "Electronic",
      "Jazz",
      "Classical",
      "R&B",
      "Country",
    ],
  },
  {
    name: "Gaming",
    topics: [
      "PC Gaming",
      "Console Gaming",
      "Mobile Gaming",
      "Esports",
      "Game Development",
      "Retro Gaming",
    ],
  },
  {
    name: "Technology",
    topics: [
      "Programming",
      "Artificial Intelligence",
      "Cybersecurity",
      "Web Development",
      "Data Science",
    ],
  },
  {
    name: "Sports",
    topics: [
      "Football",
      "Basketball",
      "Tennis",
      "Swimming",
      "Cycling",
      "Running",
    ],
  },
  {
    name: "Movies",
    topics: [
      "Action",
      "Comedy",
      "Horror",
      "Sci-Fi",
      "Documentary",
      "Animation",
    ],
  },
  {
    name: "Books",
    topics: [
      "Fiction",
      "Non-Fiction",
      "Fantasy",
      "Science Fiction",
      "Biography",
      "Mystery",
    ],
  },
  {
    name: "Food",
    topics: [
      "Cooking",
      "Baking",
      "Vegan",
      "BBQ",
      "Desserts",
      "International Cuisine",
    ],
  },
  {
    name: "Travel",
    topics: [
      "Backpacking",
      "Luxury Travel",
      "Road Trips",
      "Hiking",
      "Beach Destinations",
    ],
  },
  {
    name: "Fitness",
    topics: [
      "Weightlifting",
      "Yoga",
      "CrossFit",
      "Running",
      "Calisthenics",
      "Nutrition",
    ],
  },
  {
    name: "Art",
    topics: [
      "Painting",
      "Digital Art",
      "Photography",
      "Sculpture",
      "Street Art",
    ],
  },
];

const CreateCommunityModal = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const searchParams = useSearchParams();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors, isSubmitting },
  } = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      topics: [],
    },
  });

  // Handle file upload and preview
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "icon" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "icon") {
        setIconPreview(reader.result as string);
      } else {
        setBannerPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    setValue(type, file);
  };

  // Handle topic selection
  const handleTopicSelect = (topic: string) => {
    if (!selectedTopics.includes(topic)) {
      const newTopics = [...selectedTopics, topic];
      setSelectedTopics(newTopics);
      setValue("topics", newTopics);
    }
  };

  // Handle topic removal
  const handleTopicRemove = (topic: string) => {
    const newTopics = selectedTopics.filter((t) => t !== topic);
    setSelectedTopics(newTopics);
    setValue("topics", newTopics);
  };

  const onSubmit = async (data: CommunityFormData) => {
    console.log("Form submitted:", data);
    try {
      await createCommunity({
        ...data,
        userId: user.id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onClose = () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());

    // Remove the create-community parameter
    params.delete("create-community");

    // Replace the current URL without the parameter
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-[10] bg-black/50">
      <div className="w-[95%] md:w-[50%] h-[75%] rounded-[20px] bg-black border border-[#212121] p-[20px]">
        <div className="relative w-[100%] h-[70px] flex flex-col justify-center">
          <p className="text-[1.5rem] text-[gray] font-medium">
            Tell us about your community
          </p>
          <p className="text-[0.8rem] text-[gray] font-medium">
            A name and description help people understand what your community is
            all about.
          </p>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 w-[30px] h-[30px] flex items-center justify-center rounded-full border border-[#212121] hover:bg-[#212121]"
          >
            <Icon icon="lets-icons:close-round" className="w-[18px] h-[18px]" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[100%] h-[calc(100%-70px)] overflow-y-scroll hide-scrollbar"
        >
          <section className="w-[100%] h-[auto] flex flex-col">
            <div className="w-[100%] h-[50px] flex items-center">
              <p className="text-[1rem] font-medium">
                Community Name & Description
              </p>
            </div>
            <div className="w-[100%] h-[auto] flex flex-col">
              <div className="w-[100%] h-[70px]">
                <input
                  {...register("name")}
                  placeholder="Community Name *"
                  className="w-[100%] h-[100%] border border-[#212121] rounded-[20px] px-[10px] placeholder:text-sm bg-transparent text-white"
                />
              </div>
              <div className="w-[100%] h-[30px] flex items-center px-[10px]">
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>
            <div className="w-[100%] h-[auto] flex flex-col">
              <div className="w-[100%] h-[auto] min-h-[70px]">
                <textarea
                  {...register("description")}
                  placeholder="Description *"
                  className="w-[100%] h-[100%] border border-[#212121] rounded-[20px] p-[10px] placeholder:text-sm bg-transparent text-white"
                />
              </div>
              <div className="w-[100%] h-[30px] flex items-center px-[10px]">
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="w-[100%] h-[auto] flex flex-col">
            <div className="w-[100%] h-[50px] flex items-center">
              <p className="text-[1rem] font-medium">Banner & Icon</p>
            </div>
            <div className="relative w-[100%] h-[200px] min-h-[200px] flex flex-col justify-end rounded-[20px] z-1 mb-[20px]">
              <div className="absolute top-0 left-0 w-[100%] h-[140px] border border-[#212121] rounded-[20px] z-2 overflow-hidden">
                {bannerPreview ? (
                  <Image
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    fill={true}
                  />
                ) : (
                  <div className="w-full h-full bg-[#212121] flex items-center justify-center">
                    <p className="text-gray-500">Banner Image</p>
                  </div>
                )}
              </div>
              <div className="w-[100%] h-[50%] flex items-end px-[10px] z-3">
                <div
                  onClick={() => bannerInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  <input
                    type="file"
                    ref={bannerInputRef}
                    onChange={(e) => handleFileChange(e, "banner")}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="text-xs text-blue-500 mb-2">
                    {bannerPreview ? "Change Banner" : "Add Banner"}
                  </div>
                </div>
              </div>
              <div className="w-[100%] h-[50%] flex items-end px-[10px] z-3">
                <div
                  className="relative h-[80px] aspect-square border bg-gray-500 border-[#212121] rounded-full overflow-hidden cursor-pointer"
                  onClick={() => iconInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={iconInputRef}
                    onChange={(e) => handleFileChange(e, "icon")}
                    accept="image/*"
                    className="hidden"
                  />
                  {iconPreview ? (
                    <Image
                      src={iconPreview}
                      alt="Icon preview"
                      className="w-full h-full object-cover"
                      fill={true}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon
                        icon="mingcute:user-4-fill"
                        className="w-[30px] h-[30px] text-gray-400"
                      />
                    </div>
                  )}
                </div>
                <div
                  onClick={() => iconInputRef.current?.click()}
                  className="cursor-pointer ml-2"
                >
                  <div className="text-xs text-blue-500 mb-2">
                    {iconPreview ? "Change Icon" : "Add Icon"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-[100%] h-[auto] flex flex-col min-h-0 mt-[20px]">
            <div className="w-[100%] h-[50px] flex items-center">
              <p className="text-[1rem] font-medium">Add Topics</p>
            </div>

            <div className="w-[100%] h-[auto] flex flex-wrap justify-start mb-4">
              {selectedTopics.length > 0 ? (
                selectedTopics.map((topic) => (
                  <div
                    key={topic}
                    className="w-[auto] h-[40px] flex rounded-full border border-[#212121] bg-gray-300/10 p-[2px] mr-[10px] mb-[10px]"
                  >
                    <div className="flex-1 h-[35px] flex items-center justify-center pl-[10px] pr-[5px]">
                      <p className="text-sm">{topic}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTopicRemove(topic)}
                      className="h-[35px] aspect-square flex items-center justify-center rounded-full hover:bg-gray-300/10"
                    >
                      <Icon
                        icon="lets-icons:close-round"
                        className="w-[15px] h-[15px]"
                      />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No topics selected yet</p>
              )}
            </div>

            {errors.topics && (
              <div className="w-[100%] h-[30px] flex items-center px-[10px] mb-2">
                <p className="text-xs text-red-500">{errors.topics.message}</p>
              </div>
            )}

            <div className="w-[100%] h-[auto] flex flex-col">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="w-[100%] h-[auto] flex flex-col mb-4"
                >
                  <div className="w-[100%] h-[30px] flex items-center">
                    <p className="text-[1rem] font-medium text-[gray]">
                      {category.name}
                    </p>
                  </div>

                  <div className="w-[100%] h-[auto] flex flex-wrap justify-start">
                    {category.topics.map((topic) => (
                      <div
                        key={topic}
                        className="w-[auto] h-[30px] flex rounded-full border border-[#212121] bg-gray-300/10 mr-[10px] mb-[10px]"
                      >
                        <div className="flex-1 h-[30px] flex items-center justify-center px-[10px]">
                          <p className="text-sm">{topic}</p>
                        </div>
                        {selectedTopics.includes(topic) ? (
                          <button
                            type="button"
                            onClick={() => handleTopicRemove(topic)}
                            className="h-[30px] aspect-square flex items-center justify-center rounded-full hover:bg-gray-300/10"
                          >
                            <Icon
                              icon="lets-icons:close-round"
                              className="w-[15px] h-[15px]"
                            />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleTopicSelect(topic)}
                            className="h-[30px] aspect-square flex items-center justify-center rounded-full hover:bg-gray-300/10"
                          >
                            <Icon
                              icon="material-symbols:add"
                              className="w-[15px] h-[15px]"
                            />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div className="w-[100%] h-[60px] flex items-center justify-end mt-[20px]">
            <button
              type="submit"
              className="w-[auto] h-[40px] px-[20px] bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
            >
              <p className="text-sm">
                {isSubmitting ? "Creating..." : "Create a community"}
              </p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;
