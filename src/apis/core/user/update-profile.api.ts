import { axiosInstance } from "../index.api.ts";
import { GetUserProfileResponseDto } from "../../dto/user/get-user-profile.dto.ts";
import { UpdateProfileDto } from "../../dto/user/update-profile.dto.ts";

export const updateProfileApi = async ([token, data]: [
  string,
  UpdateProfileDto
]): Promise<GetUserProfileResponseDto> => {
  const response = await axiosInstance.patch(`/user/current`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
