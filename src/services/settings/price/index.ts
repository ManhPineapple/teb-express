import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

export const getListServices = async () => {
  try {
    const { data } = await CustomAxios.get(`/services`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách dịch vụ");
  }
};

export const getServicePrices = async () => {
  try {
    const { data } = await CustomAxios.get(`/services?has_price=yes`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải bảng giá dịch vụ");
  }
};
