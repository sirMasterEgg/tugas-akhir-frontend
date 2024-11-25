import { axiosInstance } from "../index.api.ts";
import {
  GetBlockStatusDto,
  GetBlockStatusResponseDto,
} from "../../dto/user/get-block-status.dto.ts";

export const getBlockStatusApi = async ([token, data]: [
  string,
  GetBlockStatusDto
]): Promise<GetBlockStatusResponseDto> => {
  const response = await axiosInstance.get(
    `/user/block-status/${data.userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
