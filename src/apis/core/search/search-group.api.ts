import { axiosInstance } from "../index.api.ts";
import {
  SearchGroupDto,
  SearchGroupResponseDto,
} from "../../dto/search/search-group.dto.ts";

export const searchGroupApi = async ([token, data]: [
  string,
  SearchGroupDto
]): Promise<SearchGroupResponseDto> => {
  const response = await axiosInstance.get(`/search/group`, {
    params: {
      q: data.q,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
