import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

export const getListShipments = async (params?: Record<string, any>) => {
  try {
    const { data } = await CustomAxios.get("/shipments", { params });
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách lô hàng");
  }
};

export const countShipments = async () => {
  try {
    const { data } = await CustomAxios.get("/shipments/count");
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể đếm số lượng lô hàng");
  }
};

export const getShipmentDetail = async (id: string | number) => {
  try {
    const { data } = await CustomAxios.get(`/shipments/${id}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải chi tiết lô hàng");
  }
};

export const fulfillShipment = async (id: string | number) => {
  try {
    const { data } = await CustomAxios.post(`/shipments/fulfill/${id}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể xác nhận lô hàng");
  }
};

export const cancelShipment = async (id: string | number) => {
  try {
    const { data } = await CustomAxios.put(`/shipments/cancel/${id}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể hủy lô hàng");
  }
};

export const getListShipmentItems = async (id: string | number) => {
  try {
    const { data } = await CustomAxios.get(`/shipments/items/${id}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách kiện hàng");
  }
};

export const countShipmentItems = async (id: string | number) => {
  try {
    const { data } = await CustomAxios.get(`/shipments/items/count/${id}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể đếm số lượng kiện hàng");
  }
};

export const importShipmentXlsx = async (formData: FormData) => {
  try {
    const { data } = await CustomAxios.post("/packages/import/fba", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error: any) {
    if (error?.code === "ERR_NETWORK") return { isNetworkError: true };
    if (error?.response?.status === 504) return { isTimeout: true };
    return handleAxiosError(error, "Lỗi khi nhập file Excel");
  }
};