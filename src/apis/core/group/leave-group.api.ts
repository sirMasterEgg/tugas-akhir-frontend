import { axiosInstance } from "../index.api.ts";
import {
  LeaveGroupDto,
  LeaveGroupResponseDto,
} from "../../dto/group/leave-group.dto.ts";

export const leaveGroupApi = async ([token, data]: [
  string,
  LeaveGroupDto
]): Promise<LeaveGroupResponseDto> => {
  const response = await axiosInstance.patch(
    `/group/${data.groupId}/leave`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
