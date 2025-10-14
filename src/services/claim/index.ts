import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

// 🎟️ Fetch all claims
export async function fetchClaim() {
  try {
    const { data } = await CustomAxios.get(`/tickets`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách yêu cầu");
  }
}

// 📝 Create new claim
export async function createClaim(payload: any) {
  try {
    const { data } = await CustomAxios.post(`/tickets`, payload);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tạo yêu cầu mới");
  }
}

// 🔍 Fetch ticket detail
export async function fetchTicket(id: number) {
  try {
    const { data } = await CustomAxios.get(`/tickets/${id}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải chi tiết yêu cầu");
  }
}

// 💬 Fetch messages in a ticket
export async function fetchMessage(id: number) {
  try {
    const { data } = await CustomAxios.get(`/tickets/${id}/messages`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách tin nhắn");
  }
}

// 📩 Reply to a ticket
export async function reply(ticketId: number, messageContent: string, file?: any) {
  try {
    const { data } = await CustomAxios.post(`/tickets/${ticketId}/messages`, {
      ticket_id: ticketId,
      content: messageContent,
      urls: file || [],
    });
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể gửi phản hồi");
  }
}

// 📎 Upload file to ticket
export async function updateFileTicket(payload: { file: File }) {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    const { data } = await CustomAxios.post(`/tickets/file`, formData);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải lên tệp");
  }
}