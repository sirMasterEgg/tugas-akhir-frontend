import { CheckKeyDto } from "../../dto/admin/check-key.dto.ts";
import { axiosInstance } from "../index.api.ts";
import { AxiosResponse } from "axios";

export const checkKeyApi = async ([token, { key }]: [
  string,
  CheckKeyDto
]): Promise<AxiosResponse> => {
  const response = await axiosInstance.head(`/admin/manage/key`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { key },
  });
  return response.data;
};
