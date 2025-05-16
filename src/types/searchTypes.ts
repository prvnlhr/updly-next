export interface CommunityPreview {
  id: string;
  name: string; // e.g., "r/gta6"
  displayName: string; // e.g., "GTA 6"
  iconUrl: string | null;
  memberCount: number;
}

export interface PostPreview {
  id: string;
  title: string;
  community: {
    name: string; // e.g., "r/gta6"
    displayName: string; // e.g., "GTA 6"
  };
}

export interface CommunityAndPostData {
  communities: CommunityPreview[];
  posts: PostPreview[];
}
