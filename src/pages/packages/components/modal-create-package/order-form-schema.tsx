import { z } from "zod";

export const orderFormSchema = z.object({
  service: z.string().optional(),
  recipient: z
    .string()
    .min(5, { message: "Recipient is required, at least 5 characters" }),
  phone: z.string().optional(),
  address_1: z.string().min(1, { message: "Address is required" }),
  address_2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  state_code: z.string().min(1, { message: "State code is required" }),
  country_code: z.string().optional(),
  detail: z.string().min(1, { message: "Detail is required" }),
  zipcode: z.string().min(1, { message: "Zip code is required" }),
  order_number: z.string().min(1, { message: "Order number is required" }),
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
}).refine(
  (data) =>
    data.service === "Express (CN exclusive)" ||
    (data.weight && parseFloat(data.weight) > 0),
  {
    message: "Weight is required and must be greater than 0",
    path: ["weight"],
  }
)
.refine(
  (data) =>
    data.service === "Express (CN exclusive)" ||
    (data.length && parseFloat(data.length) > 0),
  {
    message: "Length is required and must be greater than 0",
    path: ["length"],
  }
)
.refine(
  (data) =>
    data.service === "Express (CN exclusive)" ||
    (data.width && parseFloat(data.width) > 0),
  {
    message: "Width is required and must be greater than 0",
    path: ["width"],
  }
)
.refine(
  (data) =>
    data.service === "Express (CN exclusive)" ||
    (data.height && parseFloat(data.height) > 0),
  {
    message: "Height is required and must be greater than 0",
    path: ["height"],
  }
);