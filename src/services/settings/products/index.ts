import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

// 📦 Get all products
export const getProductList = async () => {
  try {
    const { data } = await CustomAxios.get(`/products`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách sản phẩm");
  }
};

// ➕ Create new product
export const createProduct = async (payload: any) => {
  try {
    const { data } = await CustomAxios.post(`/products/create`, payload);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tạo sản phẩm mới");
  }
};

// 📋 Get paginated product list
export const getProductsData = async (
  page: number,
  limit: number,
  searchValue?: string
) => {
  try {
    const { data } = await CustomAxios.get(
      `products?page=${page}&limit=${limit}` +
        (searchValue ? `&search=${searchValue}` : "")
    );
    return data.products;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải dữ liệu sản phẩm");
  }
};

// 🔢 Get product count (for pagination)
export const getProductsCount = async (
  page: number,
  limit: number,
  searchValue?: string
) => {
  try {
    const { data } = await CustomAxios.get(
      `products/count?page=${page}&limit=${limit}` +
        (searchValue ? `&search=${searchValue}` : "")
    );
    return Math.ceil(data.count / limit);
  } catch (error) {
    return handleAxiosError(error, "Không thể đếm số lượng sản phẩm");
  }
};

// 📄 Import product list from Excel
export const importXlsx = async (formData: FormData) => {
  try {
    const { data } = await CustomAxios.post("/products/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error: any) {
    if (error?.code === "ERR_NETWORK") return { isNetworkError: true };
    if (error?.response?.status === 504) return { isTimeout: true };
    return handleAxiosError(error, "Lỗi khi nhập file Excel");
  }
};

// 🧾 Get product detail
export const getProductDetail = async (id: string | number) => {
  try {
    const { data } = await CustomAxios.get(`/products/${id}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải chi tiết sản phẩm");
  }
};

// ✏️ Update product
export const updateProduct = async (id: string | number, payload: any) => {
  try {
    const { data } = await CustomAxios.put(`/products/${id}`, payload);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể cập nhật sản phẩm");
  }
};

// 🗑️ Delete product
export const deleteProduct = async (id: string | number) => {
  try {
    const { data } = await CustomAxios.delete(`/products/${id}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể xóa sản phẩm");
  }
};

export const getProductLogs = async (id: string | number) => {
  try {
    const { data } = await CustomAxios.get(`/products/log/${id}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải lịch sử sản phẩm");
  }
};
