export interface FormValues {
  title: string;
  content: string;
  media?: FileList;
  url?: string;
}

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  url?: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "LINK";
  upvotes: number;
  createdAt: string;
  author: {
    id: string;
    username: string;
  };
  community: {
    id: string;
    name: string;
  };
}