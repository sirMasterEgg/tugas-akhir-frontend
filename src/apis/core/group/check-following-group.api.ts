import { axiosInstance } from "../index.api.ts";
import {
  CheckFollowGroupDto,
  CheckFollowGroupResponseDto,
} from "../../dto/group/check-following-group.dto.ts";

export const checkFollowGroupApi = async ([token, data]: [
  string,
  CheckFollowGroupDto
]): Promise<CheckFollowGroupResponseDto> => {
  const response = await axiosInstance.get(
    `/group/${data.groupId}/check-follow`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
