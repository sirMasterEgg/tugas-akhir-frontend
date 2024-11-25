import { axiosInstance } from "../index.api.ts";
import { SearchDto, SearchResponseDto } from "../../dto/search/search.dto.ts";

export const searchApi = async ([token, data]: [
  string,
  SearchDto
]): Promise<SearchResponseDto> => {
  const response = await axiosInstance.get(`/search?q=${data.q}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
