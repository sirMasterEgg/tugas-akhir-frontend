import { axiosInstance } from "../index.api.ts";
import {
  GetSingleGroupDto,
  GetSingleGroupResponseDto,
} from "../../dto/group/get-single-group.dto.ts";

export const getSingleGroupApi = async ([token, data]: [
  string,
  GetSingleGroupDto
]): Promise<GetSingleGroupResponseDto> => {
  const response = await axiosInstance.get(`/group/${data.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
