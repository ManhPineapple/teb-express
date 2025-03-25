import { CustomAxios } from "@/utils/customAxios";

export async function getProductList() {
  try {
    const res = await CustomAxios.get(`/products`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function createProduct(payload: any) {
  try {
    const res = await CustomAxios.post(`/products/create`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const getProductsData = async (
  page: number,
  limit: number,
  searchValue?: string
) => {
  try {
    const res = await CustomAxios.get(
      `products?page=${page}&limit=${limit}` +
        (searchValue ? `&search=${searchValue}` : "")
    );

    return res.data.products;
  } catch (error) {
    console.error("Error fetching product data:", error);
    throw error;
  }
};

export const getProductsCount = async (
  page: number,
  limit: number,
  searchValue?: string
) => {
  try {
    const res = await CustomAxios.get(
      `products/count?page=${page}&limit=${limit}` +
        (searchValue ? `&search=${searchValue}` : "")
    );

    return Math.ceil(res.data.count / limit);
  } catch (error) {
    console.error("Error fetching product count:", error);
    throw error;
  }
};

export const importXlsx = async (formData: FormData) => {
  try {
    const res = await CustomAxios.post("/products/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error import:", error);
    return error.response.data;
  }
}
