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
