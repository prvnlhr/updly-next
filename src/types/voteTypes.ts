export interface VoteRequest {
  postId: string;
}

export interface VoteStatusResponse {
  userVote: "upvote" | "downvote" | null;
}

export interface VoteResult {
  id: string;
  userId: string;
  postId: string;
}
