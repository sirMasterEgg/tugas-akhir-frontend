import {
  GetManageAdminDto,
  GetManageAdminResponseDto,
} from "../../dto/admin/get-manage-admin.dto.ts";
import { axiosInstance } from "../index.api.ts";

export const getManageAdminApi = async ([token, params]: [
  string,
  GetManageAdminDto
]): Promise<GetManageAdminResponseDto> => {
  const response = await axiosInstance.get(`/admin/manage`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};
