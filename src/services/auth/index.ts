import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

const login = async (email: string, password: string) => {
  try {
    const { data } = await CustomAxios.post("/auth/sign-in", {
      email,
      password,
    });

    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

const update = async (idUser: number, userValue: Record<string, string>) => {
  try {
    const { data } = await CustomAxios.patch(`users/${idUser}`, {
      ...userValue,
    });

    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

const signup = async (user: any) => {
  try {
    const { data } = await CustomAxios.post("/auth/sign-up", {
      user,
    });

    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

const getUserInfo = async () => {
  try {
    const res = await CustomAxios.get(`/users`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getUserInfoChina = async () => {
  try {
    const res = await CustomAxios.get(`/users-china`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const userService = {
  update,
  login,
  signup,
  getUserInfo,
  getUserInfoChina
};
