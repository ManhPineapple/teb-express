import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const CustomAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

function isTokenExpired(token: any) {
  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    // if (decodedToken.exp === undefined) {
    //   console.error("Token does not have an expiration field.");
    //   return true;
    // }
    return decodedToken.ExpiredAt < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

CustomAxios.interceptors.request.use(
  (config) => {
    const { bearerToken } = useAuthStore.getState();

    if (bearerToken) {
      if (isTokenExpired(bearerToken)) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      } else {
        config.headers["Authorization"] = `Bearer ${bearerToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
CustomAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 500) {
      toast.error("Có lỗi xảy ra!");
    }
    return Promise.reject(error);
  }
);

export { CustomAxios };

