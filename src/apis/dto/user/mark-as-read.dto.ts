import { GlobalNotificationDto } from "../shared/notification.dto.ts";

export type MarkAsReadDto = {
  notificationId: string;
};

export type MarkAsReadResponseDto = {
  notifications: GlobalNotificationDto[];
};
