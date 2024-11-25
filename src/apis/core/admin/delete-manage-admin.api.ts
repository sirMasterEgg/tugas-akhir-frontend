import { axiosInstance } from "../index.api.ts";
import {
  DeleteManageAdminDto,
  DeleteManageAdminResponseDto,
} from "../../dto/admin/delete-manage-admin.dto.ts";

export const deleteManageAdminApi = async ([token, data]: [
  string,
  DeleteManageAdminDto
]): Promise<DeleteManageAdminResponseDto> => {
  const response = await axiosInstance.delete(
    `/admin/manage/${data.id}?key=${data.key}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
