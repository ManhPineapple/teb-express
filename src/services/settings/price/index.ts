import { CustomAxios } from "@/utils/customAxios";

export async function getListServices() {
  try {
    const res = await CustomAxios.get(`/services`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getServicePrices() {
  try {
    const res = await CustomAxios.get(`/services?has_price=yes`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
