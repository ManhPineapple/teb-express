import { CustomAxios } from "@/utils/customAxios";

export async function fetchNotification(
  limit: number,
  page: number,
  type: number | undefined,
  search: string
) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (type ? `&type=${type}` : "") +
      (search ? `&search=${search}` : "");
    const res = await CustomAxios.get(`/users/notifications${queryString}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function countNotification(
  limit: number,
  page: number,
  type: number | undefined,
  search: string
) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (type ? `&type=${type}` : "") +
      (search ? `&search=${search}` : "");
    const res = await CustomAxios.get(
      `/users/notifications/count${queryString}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function readNotifications() {
  try {
    const res = await CustomAxios.put(`/users/notifications/read/all`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function readNotification(id: number[]) {
  try {
    const res = await CustomAxios.put(`/users/notifications/read/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
