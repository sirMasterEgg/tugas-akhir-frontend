export type GetFollowStatusDto = {
  userId: string;
};

export type GetFollowStatusResponseDto = {
  following: boolean;
  followedBack: boolean;
};
