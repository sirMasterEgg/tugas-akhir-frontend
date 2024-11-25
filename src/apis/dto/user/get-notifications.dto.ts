import { GlobalNotificationDto } from "../shared/notification.dto.ts";
import { MetaDto } from "../shared/meta.dto.ts";

export type GetNotificationsDto = {
  page: number;
};

export type GetNotificationsResponseDto = {
  notifications: GlobalNotificationDto[];
  meta: MetaDto;
};
