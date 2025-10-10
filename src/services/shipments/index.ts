import { CustomAxios } from "@/utils/customAxios";

// 🧾 Get list of shipments
export async function getListShipments(params?: Record<string, any>) {
  try {
    const res = await CustomAxios.get("/shipments", { params });
    return res.data;
  } catch (error) {
    console.log("Error fetching shipments:", error);
    return error;
  }
}

// 🔢 Count shipments
export async function countShipments() {
  try {
    const res = await CustomAxios.get("/shipments/count");
    return res.data;
  } catch (error) {
    console.log("Error counting shipments:", error);
    return error;
  }
}

// 📦 Get shipment detail
export async function getShipmentDetail(id: string | number) {
  try {
    const res = await CustomAxios.get(`/shipments/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error fetching shipment detail:", error);
    return error;
  }
}

// ✅ Fulfill a shipment
export async function fulfillShipment(id: string | number) {
  try {
    const res = await CustomAxios.post(`/shipments/fulfill/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error fulfilling shipment:", error);
    return error;
  }
}

// ❌ Cancel a shipment
export async function cancelShipment(id: string | number) {
  try {
    const res = await CustomAxios.put(`/shipments/cancel/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error cancelling shipment:", error);
    return error;
  }
}

// 📦 Get list of shipment items
export async function getListShipmentItems(id: string | number) {
  try {
    const res = await CustomAxios.get(`/shipments/items/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error fetching shipment items:", error);
    return error;
  }
}

// 🔢 Count shipment items
export async function countShipmentItems(id: string | number) {
  try {
    const res = await CustomAxios.get(`/shipments/items/count/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error counting shipment items:", error);
    return error;
  }
}

// 📤 Import shipment via Excel (similar to Import package FBA)
export async function importShipmentXlsx(formData: FormData) {
  try {
    const res = await CustomAxios.post("/packages/import/fba", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.log("Error importing shipment Excel:", error);
    return error;
  }
}
