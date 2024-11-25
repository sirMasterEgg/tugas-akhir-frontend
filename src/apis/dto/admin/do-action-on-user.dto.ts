export type DoActionOnUserDto = {
  action: "ban" | "warn" | "timeout" | "unban";
  userId: string;
};

export type DoActionOnUserResponseDto = {
  message: string;
};
