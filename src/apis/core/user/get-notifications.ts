import { axiosInstance } from "../index.api.ts";
import {
  GetNotificationsDto,
  GetNotificationsResponseDto,
} from "../../dto/user/get-notifications.dto.ts";

export const getNotificationsApi = async ([token, data]: [
  string,
  GetNotificationsDto
]): Promise<GetNotificationsResponseDto> => {
  const response = await axiosInstance.get(
    `/user/notification?page=${data.page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
