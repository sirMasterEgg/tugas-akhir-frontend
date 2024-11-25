import {
  CreateGroupDto,
  CreateGroupResponseDto,
} from "../../dto/group/create-group.dto.ts";
import { axiosInstance } from "../index.api.ts";

export const createGroupApi = async ([token, data]: [
  string,
  CreateGroupDto
]): Promise<CreateGroupResponseDto> => {
  const response = await axiosInstance.post(`/group`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
