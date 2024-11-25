import { axiosInstance } from "../index.api.ts";
import {
  GetUserPostsDto,
  GetUserPostsResponseDto,
} from "../../dto/user/get-user-posts.dto.ts";

export const getUserPostsApi = async ([token, data]: [
  string,
  GetUserPostsDto
]): Promise<GetUserPostsResponseDto> => {
  const response = await axiosInstance.get(
    `/user/question/${data.userId}?page=${data.page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
