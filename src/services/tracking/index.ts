import { CustomAxios } from "@/utils/customAxios";

interface LogsRequest {
  codes: string[];
}
export async function getLogs(payload: LogsRequest) {
  try {
    const res = await CustomAxios.post(`/packages/logs`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
