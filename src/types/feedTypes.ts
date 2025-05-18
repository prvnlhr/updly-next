// src/types/feedTypes.ts
export interface FeedPost {
  id: string;
  title: string;
  content: string | null;
  mediaUrl: string | null;
  url: string | null;
  type: "TEXT" | "IMAGE" | "VIDEO" | "LINK";
  upvotes: number;
  createdAt: Date;
  author: {
    id: string;
    username: string;
  };
  community: {
    id: string;
    name: string;
    displayName: string;
  };
  commentCount: number;
  userVote: boolean | null;
}

export interface FeedResponse {
  posts: FeedPost[];
  hasMore: boolean;
}
