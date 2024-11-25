import { axiosInstance } from "../index.api.ts";
import {
  SearchUserDto,
  SearchUserResponseDto,
} from "../../dto/search/search-user.dto.ts";

export const searchUserApi = async ([token, data]: [
  string,
  SearchUserDto
]): Promise<SearchUserResponseDto> => {
  const response = await axiosInstance.get(`/search/user`, {
    params: {
      username: data.username,
      page: data.page,
      size: data.size,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
