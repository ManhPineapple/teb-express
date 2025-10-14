import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

interface LogsRequest {
  codes: string[];
}
export async function getLogs(payload: LogsRequest) {
  try {
    const res = await CustomAxios.post(`/packages/logs`, payload);
    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
}
