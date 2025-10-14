import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axios from "axios";

interface FetchBarcodeFileParams {
  url: string;
  type: string;
}

// 📦 Get packages in holding
export async function getPackagesHolding(
  page: number,
  limit: number,
  search?: URLSearchParams
) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (search?.get("start_date") ? `&start_date=${search.get("start_date")}` : "") +
      (search?.get("end_date") ? `&end_date=${search.get("end_date")}` : "") +
      (search?.get("search") ? `&search=${search.get("search")}` : "");

    const { data } = await CustomAxios.get(`/packages/holding${queryString}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách kiện hàng đang giữ");
  }
}

// 📦 Get package detail
export async function getPackagesDetail(package_id: string) {
  try {
    const { data } = await CustomAxios.get(`/packages/${package_id}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải chi tiết kiện hàng");
  }
}

// 🧾 Download CN invoice image
export async function downloadCNInvoiceImage(url: string) {
  try {
    const { data } = await CustomAxios.get(
      `/uploads/file-export/download?type=export_packages&url=${url}`,
      { responseType: "blob" }
    );
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải hình ảnh hóa đơn");
  }
}

// 🖼 Upload invoice image
export const uploadImage = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const { data } = await CustomAxios.post(`/packages/upload_invoice`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data.url;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải lên hình ảnh hóa đơn");
  }
};

// 📦 Create a package
export const createPackage = async (values: any) => {
  try {
    const { data } = await CustomAxios.post(`/packages/create`, values);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Đã xảy ra lỗi trong quá trình tạo đơn.");
  }
};

// ❌ Cancel packages
export const cancelPackages = async (ids: any) => {
  try {
    const { data } = await CustomAxios.put(`/packages/cancel`, ids);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Đã xảy ra lỗi trong quá trình hủy đơn.");
  }
};

// ✏️ Update package
export const updatePackages = async (id: any, values: any) => {
  try {
    const { data } = await CustomAxios.put(`/packages/${id}`, values);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể cập nhật kiện hàng");
  }
};

// 📦 Get return packages
export async function fetchPackagesReturn() {
  try {
    const { data } = await CustomAxios.get(`/packages/return`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách kiện hoàn");
  }
}

// ⚙️ Process package
export const processPackage = async (payload: any) => {
  try {
    const { data } = await CustomAxios.post(`/packages/process`, payload);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể xử lý kiện hàng");
  }
};

// 🏠 Validate address (external endpoint)
export const validateAddress = async (payload: any) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    const newUrl = baseUrl.split("/").slice(0, -2).join("/");
    const { data } = await axios.post(`${newUrl}/v1/packages/address/validate`, payload);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể xác thực địa chỉ");
  }
};

// 🏷 Fetch label (barcode / invoice)
export const fetchLabel = async ({ url, type }: FetchBarcodeFileParams) => {
  try {
    const { data } = await CustomAxios.get(`/uploads/file-export/download`, {
      params: { url, type },
      responseType: "blob",
    });
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải nhãn kiện hàng");
  }
};

// 📋 Get list of packages
export async function getListPackages(
  page: number,
  pageLimit: number,
  order_number: string,
  status: string,
  startDate?: string,
  endDate?: string,
  byDate?: string,
  service?: string
) {
  try {
    const { data } = await CustomAxios.get("/packages", {
      params: {
        page,
        limit: pageLimit,
        code: order_number,
        status,
        start_date: startDate,
        end_date: endDate,
        by_date: byDate,
        service,
      },
    });
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách kiện hàng");
  }
}

// 🔢 Count packages
export async function getCountListPackages(
  page: number,
  pageLimit: number,
  order_number: string,
  status: string,
  startDate?: string,
  endDate?: string,
  byDate?: string,
  service?: string
) {
  try {
    const { data } = await CustomAxios.get(`/packages/count`, {
      params: {
        page,
        limit: pageLimit,
        code: order_number,
        status,
        start_date: startDate,
        end_date: endDate,
        by_date: byDate,
        service,
      },
    });
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể đếm số lượng kiện hàng");
  }
}

// 📤 Import package Excel
export async function importXlsx(formData: FormData, isCNTemplate: boolean) {
  try {
    const { data } = await CustomAxios.post(
      `/packages/import${isCNTemplate ? "?package_type=CN" : ""}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  } catch (error: any) {
    if (error?.code === "ERR_NETWORK") return { isNetworkError: true };
    if (error?.response?.status === 504) return { isTimeout: true };
    return handleAxiosError(error, "Không thể nhập file Excel kiện hàng");
  }
}

// 📁 Export selected packages
export async function getExportedFile(selectedIds: number[]) {
  try {
    const { data: downloadData } = await CustomAxios.post("/packages/export", {
      ids: selectedIds,
    });

    const downloadUrl = `/uploads/file-export/download?type=export_packages&url=${downloadData.download}`;
    const { data, headers } = await CustomAxios.get(downloadUrl, { responseType: "blob" });

    return {
      file: data,
      filename: downloadData.download,
      fileType: headers["content-type"],
    };
  } catch (error) {
    return handleAxiosError(error, "Không thể tải file xuất kiện hàng");
  }
}
