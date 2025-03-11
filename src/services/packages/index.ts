import { CustomAxios } from "@/utils/customAxios";
import { toast } from "react-toastify";

interface FetchBarcodeFileParams {
  url: string;
  type: string;
}

export async function getPackagesHolding(
  page: number,
  limit: number,
  search?: any
) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (search.get("start_date")
        ? `&start_date=${search.get("start_date")}`
        : "") +
      (search.get("end_date") ? `&end_date=${search.get("end_date")}` : "") +
      (search.get("search") ? `&search=${search.get("search")}` : "");

    const res = await CustomAxios.get(`/packages/holding${queryString}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getPackagesHoldingChina(
  page: number,
  limit: number,
  search?: any
) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (search.get("start_date")
        ? `&start_date=${search.get("start_date")}`
        : "") +
      (search.get("end_date") ? `&end_date=${search.get("end_date")}` : "") +
      (search.get("search") ? `&search=${search.get("search")}` : "");

    const res = await CustomAxios.get(`/packages/holdingChina${queryString}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getPackagesDetail(package_id: string) {
  try {
    const res = await CustomAxios.get(`/packages/${package_id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const uploadCnInvoiceImage = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const res = await CustomAxios.post(`/packages/upload_invoice`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  } catch (error) {
    console.error("Error uploading invoice image:", error);
    throw error;
  }
};

export const createPackage = async (values: any) => {
  try {
    const res = await CustomAxios.post(`/packages/create`, values);
    return res.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const cancelPackages = async (ids: any) => {
  try {
    const res = await CustomAxios.put(`/packages/cancel`, ids);
    return res.data;
  } catch (error) {
    //@ts-ignore
    toast.error(error.response.data || error.message);
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updatePackages = async (id: any, values: any) => {
  try {
    const res = await CustomAxios.put(`/packages/${id}`, values);
    return res.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export async function fetchPackagesReturn() {
  try {
    const res = await CustomAxios.get(`/packages/return`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const processPackage = async (payload: any) => {
  try {
    const res = await CustomAxios.post(`/packages/process`, payload);
    return res.data;
  } catch (error) {
    //@ts-ignore
    toast.error(error.response.data || error.message);
    console.error("Error creating process:", error);
    throw error;
  }
};

export const validateAddress = async (payload: any) => {
  try {
    const res = await CustomAxios.post(`/packages/validate-address`, payload);
    return res;
  } catch (error) {
    console.error("Error validate address:", error);
    throw error;
  }
};

export const fetchBarcodeFile = async ({
  url,
  type,
}: FetchBarcodeFileParams) => {
  try {
    const res = await CustomAxios.get(`/uploads/file-export/download`, {
      params: { url, type },
      responseType: "blob",
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

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
    const queryString =
      `?page=${page}&limit=${pageLimit}` +
      (order_number ? `&code=${order_number}` : "") +
      (status ? `&status=${status}` : "") +
      (startDate ? `&start_date=${startDate}` : "") +
      (endDate ? `&end_date=${endDate}` : "") +
      (byDate ? `&by_date=${byDate}` : "") + 
      (service ? `&service=${service}` : "");

    const res = await CustomAxios.get(`/packages${queryString}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

export async function getCountListPackages(
  page: number,
  pageLimit: number,
  order_number: string,
  status: string,
  startDate?: string,
  endDate?: string,
  byDate?: string,
  service?: string,
) {
  try {
    const queryString =
      `?page=${page}&limit=${pageLimit}` +
      (order_number ? `&code=${order_number}` : "") +
      (status ? `&status=${status}` : "") +
      (startDate ? `&start_date=${startDate}` : "") +
      (endDate ? `&end_date=${endDate}` : "") +
      (byDate ? `&by_date=${byDate}` : "") +
      (service ? `&service=${service}` : "");

    const res = await CustomAxios.get(`/packages/count${queryString}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

export async function importXlsx(formData: FormData) {
  try {
    const res = await CustomAxios.post("/packages/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error import:", error);
    return error;
  }
}

export async function getExportedFile(selectedIds: number[]) {
  try {
    const downloadUrlResponse = await CustomAxios.post("/packages/export", {
      ids: selectedIds,
    });
    const downloadUrl = `/uploads/file-export/download?type=export_packages&url=${downloadUrlResponse.data.download}`;
    const res = await CustomAxios.get(downloadUrl, {
      responseType: "blob",
    });
    return {
      file: res.data,
      filename: downloadUrlResponse.data.download,
      fileType: res.headers["content-type"],
    };
  } catch (error) {
    return error;
  }
}
