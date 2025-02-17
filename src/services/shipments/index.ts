import { CustomAxios } from "@/utils/customAxios";

export async function getListShipments() {
  try {
    const res = await CustomAxios.get(`/shipments`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getShipmentsDetail(id: string) {
  try {
    const res = await CustomAxios.get(`/shipments/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function getListShipmentItems(id: string) {
  try {
    const res = await CustomAxios.get(`/shipments/${id}/items`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
