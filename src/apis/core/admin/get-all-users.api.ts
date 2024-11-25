import { axiosInstance } from "../index.api.ts";
import {
  GetAllUsersDto,
  GetAllUsersResponseDto,
} from "../../dto/admin/get-all-users.dto.ts";

export const getAllUsersApi = async ([token, data]: [
  string,
  GetAllUsersDto
]): Promise<GetAllUsersResponseDto> => {
  const search = new URLSearchParams();

  if (data.page) {
    search.append("page", data.page.toString());
  }

  if (data.size) {
    search.append("size", data.size.toString());
  }

  if (data.filter) {
    search.append("filter", data.filter);
  }

  if (data.search) {
    search.append("q", data.search);
  }

  const response = await axiosInstance.get(
    `/admin/users?${search.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
