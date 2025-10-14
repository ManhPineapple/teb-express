import { CustomAxios } from "@/utils/customAxios";
import { handleAxiosError } from "@/utils/handleAxiosError";

// 📄 Get list of transactions
export async function getTransactions(
  page: number,
  limit: number,
  search?: any,
  selectedType?: number
) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (search?.get("start_date")
        ? `&start_date=${search.get("start_date")}`
        : "") +
      (search?.get("end_date") ? `&end_date=${search.get("end_date")}` : "") +
      (selectedType ? `&type=${selectedType}` : "");

    const { data } = await CustomAxios.get(`/transactions${queryString}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách giao dịch");
  }
}

// 💰 Get list of bills
export async function getBillList(page: number, limit: number, search?: any) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (search?.get("start_date")
        ? `&start_date=${search.get("start_date")}`
        : "") +
      (search?.get("end_date") ? `&end_date=${search.get("end_date")}` : "") +
      (search?.get("search") ? `&search=${search.get("search")}` : "");

    const { data } = await CustomAxios.get(`/bills/list${queryString}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách hóa đơn");
  }
}

// 🧾 Get bill detail
export async function getBillDetails(code: string) {
  try {
    const { data } = await CustomAxios.get(`/bills/${code}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải chi tiết hóa đơn");
  }
}

// 📦 Get packages in a bill
export async function getBillPackages(code: string) {
  try {
    const { data } = await CustomAxios.get(`/bills/packages/${code}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải danh sách kiện hàng");
  }
}

// 💸 Get extra fee info
export async function getExtraFee(code: string) {
  try {
    const { data } = await CustomAxios.get(`/bills/fees/${code}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải phí phát sinh");
  }
}

// 🧾 Get invoice download URL
export async function getInvoiceDownloadUrl(invoiceId: string) {
  try {
    const { data } = await CustomAxios.get(`/bills/invoice/${invoiceId}`);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải link hóa đơn");
  }
}

// 📥 Download invoice file
export async function getInvoice(invoiceUrl: string) {
  try {
    const { data } = await CustomAxios.get(
      `/uploads/file-export/download?type=export_billing&url=${invoiceUrl}`,
      { responseType: "blob" }
    );
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tải file hóa đơn");
  }
}

// 🧾 Create pending transaction
export async function createPendingTransaction(body: any) {
  try {
    const { data } = await CustomAxios.post("/transactions", body);
    return data;
  } catch (error) {
    return handleAxiosError(error, "Không thể tạo giao dịch mới");
  }
}
