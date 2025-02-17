import { CustomAxios } from "@/utils/customAxios";

export async function getListCoupons() {
  try {
    const res = await CustomAxios.get(`/packages/coupons`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
