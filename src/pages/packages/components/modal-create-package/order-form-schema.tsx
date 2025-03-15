import { z } from "zod";

export const orderFormSchema = z.object({
  service: z.string().optional(),
  recipient: z
    .string()
    .min(5, { message: "Người nhận là bắt buộc, ít nhất 5 ký tự" }),
  phone: z.string().optional(),
  address_1: z.string().min(1, { message: "Địa chỉ là bắt buộc" }),
  address_2: z.string().optional(),
  city: z.string().min(1, { message: "Thành phố là bắt bộc" }),
  state_code: z.string().min(1, { message: "Bang là bắt buộc" }),
  country_code: z.string().optional(),
  detail: z.string().min(1, { message: "Chi tiết là bắt buộc" }),
  zipcode: z.string().min(1, { message: "Mã bưu điện là bắt buộc" }),
  order_number: z.string().min(1, { message: "Mã đơn hàng là bắt buộc" }),
  weight: z.string().optional(),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  include_battery: z.boolean().optional(),
  package_products: z.array(z.any()).optional(),
  scan_days: z.string().optional(),
  custom_url: z.string().optional(),
  package_name: z.string().optional(),
  package_quantity: z.string().optional(),
  product_price: z.string().optional(),

  is_purchased: z.boolean().optional(),
  cn_product_link: z.string().optional(),
  cn_product_price: z.string().optional(),
  cn_shipping_fee: z.string().optional(),
  custom_cn_barcode: z.string().optional(),
  image: z.instanceof(File).optional(),
  cn_invoice_image: z.string().optional(),
}).refine(
  (data) =>
    data.service === "Express (CN exclusive)" ||
    (data.weight && parseFloat(data.weight) > 0),
  {
    message: "rọng lượng là bắt buộc và phải lớn hơn 0",
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
  );