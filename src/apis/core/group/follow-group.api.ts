import { axiosInstance } from "../index.api.ts";
import {
  FollowGroupDto,
  FollowGroupResponseDto,
} from "../../dto/group/follow-group.dto.ts";

export const followGroupApi = async ([token, data]: [
  string,
  FollowGroupDto
]): Promise<FollowGroupResponseDto> => {
  const response = await axiosInstance.post(
    `/group/${data.groupId}/follow`,
    { follow: data.follow },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
