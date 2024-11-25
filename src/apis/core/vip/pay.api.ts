import { axiosInstance } from "../index.api.ts";
import { PayResponseDto } from "../../dto/vip/pay.dto.ts";

export const payApi = async ([token]: [string]): Promise<PayResponseDto> => {
  const response = await axiosInstance.post(
    `/vip/pay`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
