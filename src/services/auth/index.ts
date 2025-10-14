import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

interface UpdateUserPayload {
  password: string;
  newPassword: string;
  name: string;
}

export const login = async (email: string, password: string) => {
  try {
    const { data } = await CustomAxios.post("/auth/sign-in", {
      email,
      password,
    });
    return data;
  } catch (error) {
    return handleAxiosError(error, "Đăng nhập thất bại");
  }
};

export const signup = async (user: any) => {
  try {
    const { data } = await CustomAxios.post("/auth/sign-up", { user });
    return data;
  } catch (error) {
    return handleAxiosError(error, "Đăng ký thất bại");
  }
};

export const getUserInfo = async () => {
  try {
    const { data } = await CustomAxios.get("/users");
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const updateUser = async (payload: UpdateUserPayload) => {
  try {
    if (payload.password === payload.newPassword) {
      throw new Error("Mật khẩu mới phải khác mật khẩu hiện tại");
    }

    const body = {
      birthday: "",
      current_password: payload.password,
      new_password: payload.newPassword,
      full_name: payload.name,
      push_bookmark: false,
    };

    const { data } = await CustomAxios.put("/users/update", body);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Cập nhật thông tin thất bại");
  }
};

export const getToken = async () => {
  try {
    const { data } = await CustomAxios.get("/users/token");
    return data?.token;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const resetToken = async () => {
  try {
    const { data } = await CustomAxios.put("/users/token");
    return data?.token;
  } catch (error) {
    return handleAxiosError(error);
  }
};
