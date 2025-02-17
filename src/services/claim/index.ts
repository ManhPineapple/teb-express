import { CustomAxios } from "@/utils/customAxios";

export async function fetchClaim() {
  try {
    const res = await CustomAxios.get(`/tickets`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const createClaim = async (payload: any) => {
  try {
    const res = await CustomAxios.post(`/tickets`, payload);
    return res;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export async function fetchTicket(id: number) {
  try {
    const res = await CustomAxios.get(`/tickets/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function fetchMessage(id: number) {
  try {
    const res = await CustomAxios.get(`/tickets/${id}/messages`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const reply = async (
  ticketId: number,
  messageContent: string,
  file: any
) => {
  try {
    const res = await CustomAxios.post(`/tickets/${ticketId}/messages`, {
      ticket_id: ticketId,
      content: messageContent,
      urls: file || [],
    });
    return res.data;
  } catch (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
};

export const updateFileTicket = async (payload: { file: File }) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    const res = await CustomAxios.post(`/tickets/file`, formData);
    return res.data;
  } catch (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
};
