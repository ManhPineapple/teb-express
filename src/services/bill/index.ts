import { CustomAxios } from "@/utils/customAxios";
export async function getTransactions(
  page: number,
  limit: number,
  search?: any,
  selectedType?: number
) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (search.get("start_date")
        ? `&start_date=${search.get("start_date")}`
        : "") +
      (search.get("end_date") ? `&end_date=${search.get("end_date")}` : "") +
      (selectedType ? `&type=${selectedType}` : "");

    const res = await CustomAxios.get(`/transactions${queryString}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getTransactionsChina(
  page: number,
  limit: number,
  search?: any,
  selectedType?: number
) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (search.get("start_date")
        ? `&start_date=${search.get("start_date")}`
        : "") +
      (search.get("end_date") ? `&end_date=${search.get("end_date")}` : "") +
      (selectedType ? `&type=${selectedType}` : "");

    const res = await CustomAxios.get(`/transactions/china${queryString}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getBillList(page: number, limit: number, search?: any) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (search.get("start_date")
        ? `&start_date=${search.get("start_date")}`
        : "") +
      (search.get("end_date") ? `&end_date=${search.get("end_date")}` : "") +
      (search.get("search") ? `&search=${search.get("search")}` : "");

    const res = await CustomAxios.get(`/bills/list${queryString}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getBillListChina(page: number, limit: number, search?: any) {
  try {
    const queryString =
      `?page=${page}&limit=${limit}` +
      (search.get("start_date")
        ? `&start_date=${search.get("start_date")}`
        : "") +
      (search.get("end_date") ? `&end_date=${search.get("end_date")}` : "") +
      (search.get("search") ? `&search=${search.get("search")}` : "");

    const res = await CustomAxios.get(`/bills/listChina${queryString}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getBillDetails(code: string) {
  try {
    const res = await CustomAxios.get(`/bills/${code}`);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch bill detail");
  }
}

export async function getBillPackages(code: string) {
  try {
    const res = await CustomAxios.get(`/bills/${code}/packages`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getExtraFee(code: string) {
  try {
    const res = await CustomAxios.get(`/bills/${code}/fees`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getInvoiceDownloadUrl(invoiceId: string) {
  try {
    const res = await CustomAxios.get(`/bills/invoice/${invoiceId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getInvoice(invoiceUrl: string) {
  try {
    const res = await CustomAxios.get(
      `/uploads/file-export/download?type=export_billing&url=${invoiceUrl}`,
      { responseType: "blob" }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function createPendingTransaction(body: any) {
  try {
    const res = await CustomAxios.post('/transactions', body);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
