import { axiosInstance } from "../index.api.ts";
import {
  UpdateManageAdminDto,
  UpdateManageAdminResponseDto,
} from "../../dto/admin/update-manage-admin.dto.ts";

export const updateManageAdminApi = async ([token, data]: [
  string,
  UpdateManageAdminDto
]): Promise<UpdateManageAdminResponseDto> => {
  const { id, ...removedId } = data;
  const response = await axiosInstance.patch(`/admin/manage/${id}`, removedId, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
