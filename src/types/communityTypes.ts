export interface UserCommunitiesResponse {
  createdCommunities: {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    iconUrl: string | null;
    bannerUrl: string | null;
    createdAt: Date;
    memberCount: number;
    postCount: number;
  }[];
  joinedCommunities: {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    iconUrl: string | null;
    bannerUrl: string | null;
    createdAt: Date;
    memberCount: number;
    postCount: number;
  }[];
}

export interface CommunityDetails {
  community: CommunityData;
  posts: PostData[];
}

export interface CommunityData {
  id?: string;
  name: string;
  displayName: string;
  description: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    members: number;
    posts: number;
  };
}

export interface PostData {
  id: string;
  title: string;
  content: string;
  mediaUrl: string | null;
  url: string | null;
  type: PostType;
  upvotes: number;
  createdAt: Date;
  author: {
    id: string;
    username: string;
  };
  _count: {
    comments: number;
  };
}

export enum PostType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  LINK = "LINK",
}
