import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

// 🧾 Create new top-up transaction
export const createTopupTransaction = async () => {
  try {
    const { data } = await CustomAxios.post("/transactions/top-up");
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tạo yêu cầu nạp tiền");
  }
};

// 💰 Update top-up transaction amount
export const updateTopupTransaction = async (
  id: string | number,
  amount: number
) => {
  try {
    const { data } = await CustomAxios.post(`/transactions/top-up/update/${id}`, {
      amount,
    });
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể cập nhật yêu cầu nạp tiền");
  }
};
