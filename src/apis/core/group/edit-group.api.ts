import { axiosInstance } from "../index.api.ts";
import {
  EditGroupDto,
  EditGroupResponseDto,
} from "../../dto/group/edit-group.dto.ts";

export const editGroupApi = async ([token, data]: [
  string,
  EditGroupDto
]): Promise<EditGroupResponseDto> => {
  const { groupId, ...restData } = data;
  const response = await axiosInstance.patch(`/group/${groupId}`, restData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
