import { GlobalUserDto } from "./user.dto.ts";

export type GlobalNotificationDto = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: GlobalUserDto;
};
