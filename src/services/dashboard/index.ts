import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

export async function fetchAnalytics(startDate: any, endDate: any) {
  try {
    const res = await CustomAxios.get(
      `/analytics?start_date=${startDate}&end_date=${endDate}`
    );
    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
}
