import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

export const getListCoupons = async () => {
  try {
    const { data } = await CustomAxios.get(`/packages/coupons`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách mã giảm giá");
  }
};
