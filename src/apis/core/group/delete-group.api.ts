import { axiosInstance } from "../index.api.ts";
import {
  DeleteGroupDto,
  DeleteGroupResponseDto,
} from "../../dto/group/delete-group.dto.ts";

export const deleteGroupApi = async ([token, data]: [
  string,
  DeleteGroupDto
]): Promise<DeleteGroupResponseDto> => {
  const response = await axiosInstance.delete(`/group/${data.groupId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
