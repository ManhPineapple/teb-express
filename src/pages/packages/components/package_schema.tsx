import { z } from "zod";

export const orderFormSchema = z
  .object({
    service: z.string().optional(),
    recipient: z
      .string()
      .min(5, { message: "Người nhận là bắt buộc, ít nhất 5 ký tự" })
      .optional(),
    phone: z.string().optional(),
    address_1: z.string().min(1, { message: "Địa chỉ là bắt buộc" }).optional(),
    address_2: z.string().optional(),
    city: z.string().min(1, { message: "Thành phố là bắt buộc" }).optional(),
    state_code: z.string().min(1, { message: "Bang là bắt buộc" }).optional(),
    country_code: z.string().optional(),

    zipcode: z
      .string()
      .min(1, { message: "Mã bưu điện là bắt buộc" })
      .optional(),
    order_number: z.string().min(1, { message: "Mã đơn hàng là bắt buộc" }),
    detail: z.string().min(1, { message: "Chi tiết là bắt buộc" }),
    weight: z.string().optional(),
    length: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    include_battery: z.boolean().optional(),

    package_products: z.array(z.any()).optional(),
    package_name: z.string().optional(),
    package_quantity: z.string().optional(),
    product_price: z.string().optional(),
    is_purchased: z.boolean().optional(),
    cn_product_link: z.string().optional(),
    cn_product_image: z.string().optional(),
    cn_note: z.string().optional(),
    cn_product_price: z.string().optional(),
    cn_shipping_fee: z.string().optional(),
    custom_cn_barcode: z.string().optional(),
    image: z.instanceof(File).optional(),
    cn_invoice_image: z.string().optional(),
    custom_tiktok_barcode: z.string().optional(),
    is_early_scan: z.boolean().optional(),
    has_tiktok_label: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.service === "Express (CN exclusive)" ||
      (data.weight && parseFloat(data.weight) > 0),
    {
      message: "Trọng lượng là bắt buộc và phải lớn hơn 0",
      path: ["weight"],
    }
  )
  .refine(
    (data) =>
      data.service === "Express (CN exclusive)" ||
      (data.length && parseFloat(data.length) > 0),
    {
      message: "Chiều dài là bắt buộc và phải lớn hơn 0",
      path: ["length"],
    }
  )
  .refine(
    (data) =>
      data.service === "Express (CN exclusive)" ||
      (data.width && parseFloat(data.width) > 0),
    {
      message: "Chiều rộng là bắt buộc và phải lớn hơn 0",
      path: ["width"],
    }
  )
  .refine(
    (data) =>
      data.service === "Express (CN exclusive)" ||
      (data.height && parseFloat(data.height) > 0),
    {
      message: "Chiều cao là bắt buộc và phải lớn hơn 0",
      path: ["height"],
    }
  )

export type PackageDetail = {
  id: number;
  order_number: string;
  label: string;
  recipient: string;
  company: string;
  phone_number: string;
  address_1: string;
  address_2: string;
  city: string;
  state_code: string;
  zipcode: string;
  country_code: string;
  detail: string;
  weight: number;
  width: number;
  length: number;
  height: number;
  actual_weight: number;
  actual_width: number;
  actual_length: number;
  actual_height: number;
  status_string: string;
  service_id: number;
  note: string;
  service_name: string;
  service_code: string;
  tracking_number: string;
  code_package: string;
  shipping_fee: number;
  created_at: string;
  alert: number;
  is_insured: boolean;
  estimate_date_process: string;
  is_package_exceed: boolean;
  include_battery: boolean;
  package_products: any[];

  package_name: string;
  package_quantity: number;
  product_price: number;
  is_purchased: boolean;
  cn_product_link: string;
  cn_product_price: string;
  cn_product_image: string;
  cn_invoice_image: string;
  cn_shipping_fee: string;
  custom_cn_barcode: string;
  cn_note: string;

  custom_tiktok_barcode: string;
  is_early_scan: boolean;
};
