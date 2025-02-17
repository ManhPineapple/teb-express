import { CustomAxios } from "@/utils/customAxios";

export async function fetchAnalytics(startDate: any, endDate: any) {
  try {
    const res = await CustomAxios.get(
      `/analytics?start_date=${startDate}&end_date=${endDate}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
