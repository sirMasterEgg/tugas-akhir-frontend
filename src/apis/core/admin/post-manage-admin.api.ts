import { axiosInstance } from "../index.api.ts";
import {
  PostManageAdminDto,
  PostManageAdminResponseDto,
} from "../../dto/admin/post-manage-admin.dto.ts";

export const postManageAdminApi = async ([token, data]: [
  string,
  PostManageAdminDto
]): Promise<PostManageAdminResponseDto> => {
  const response = await axiosInstance.post(`/admin/manage`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
