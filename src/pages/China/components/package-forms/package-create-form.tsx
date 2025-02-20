"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import Heading from "@/components/shared/heading";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TUSState, US_STATES } from "@/constants/packages";
import { createPackage, getListPackages } from "@/services/packages";
import { getListServices } from "@/services/settings/price";
import { getProductList } from "@/services/settings/products";
import { usePackageStore } from "@/store/tableStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { uniqueId } from "lodash";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";

const orderFormSchema = z.object({
  service: z.string().min(1, { message: "Service is required" }),
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
  weight: z
    .string()
    .min(1, { message: "Weight is required" })
    .refine((val) => parseFloat(val) > 0, {
      message: "weight must be greater than 0",
    }),
  length: z
    .string()
    .min(1, { message: "Length is required" })
    .refine((val) => parseFloat(val) > 0, {
      message: "Length must be greater than 0",
    }),
  width: z
    .string()
    .min(1, { message: "Width is required" })
    .refine((val) => parseFloat(val) > 0, {
      message: "Width must be greater than 0",
    }),
  height: z
    .string()
    .min(1, { message: "Height is required" })
    .refine((val) => parseFloat(val) > 0, {
      message: "Height must be greater than 0",
    }),
  include_battery: z.boolean().optional(),
  package_products: z.array(z.any()).optional(),
  scan_days: z.string().optional(),
  custom_url: z.string().optional(),
  package_name: z.string().optional(),
  package_quantity: z.string().optional(),
  product_price: z.string().optional(),
  custom_cn_barcode: z.string().optional(),
});

type OrderFormSchemaType = z.infer<typeof orderFormSchema>;

type ProductFormProps = {
  control: any;
  index: number;
  product: Product[] | null;
  onRemove: (arg0: number) => void;
};

type Service = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  sku: string;
  name: string;
};

const ProductForm: React.FC<ProductFormProps> = ({
  control,
  index,
  product,
  onRemove,
}) => {
  const [productName, setProductName] = useState("");

  const handleSKUChange = (field: any, value: string) => {
    const selectedProduct = product?.find((pd) => pd.sku === value);
    setProductName(selectedProduct?.name || "");
    field.onChange(value);
  };

  return (
    <div className="flex border p-4 shadow-sm">
      <div className="flex-1 min-w-[25%]">
        <FormField
          control={control}
          name={`package_products[${index}].sku`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => handleSKUChange(field, value)}
                >
                  <SelectTrigger className="mb-4 box-border h-[48px] w-full px-[0.75rem] text-base leading-6">
                    <SelectValue placeholder="Chọn SKU" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea type="always" className="max-h-64">
                      {product?.map((pd) => (
                        <SelectItem key={pd.id} value={pd.sku}>
                          {pd.sku}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex-1 min-w-[45%]">
        <FormField
          control={control}
          name={`package_products[${index}].name`}
          render={() => (
            <FormItem>
              <FormControl>
                <Input
                  disabled
                  value={productName}
                  placeholder="Tên sản phẩm"
                  className="px-4 py-6 shadow-inner drop-shadow-xl bg-gray-300 w-full"
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex-1 min-w-[20%]">
        <FormField
          control={control}
          name={`package_products[${index}].quantity`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  required={false}
                  defaultValue={1}
                  placeholder="Số lượng"
                  type="number"
                  {...field}
                  className="px-4 py-6 shadow-inner drop-shadow-xl w-full"
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="w-8 h-8 ml-2 mt-2 bg-gray-300 text-white rounded-xl hover:bg-red-500"
      >
        X
      </button>
    </div>
  );
};

import { useWatch } from "react-hook-form";

const OrderCreateForm = ({ modalClose }: { modalClose: () => void }) => {
  const createOrderForm = useForm<OrderFormSchemaType>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      package_products: [{}],
    },
  });

  const productValue = useWatch({
    control: createOrderForm.control,
    name: `package_products`,
  });

  console.log("productValue:", productValue);

  const scanDaysValue = useWatch({
    control: createOrderForm.control,
    name: `scan_days`,
  });

  const handleSKUChange = (field: any, value: string) => {
    field.onChange(value);
  };

  const [selectedState, setSelectedState] = useState("");
  const [filteredStates, setFilteredStates] = useState<TUSState[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setSelectedState(value);
    if (value.length > 0) {
      const filtered = US_STATES
        // filter by state_code
        .filter(
          (state) =>
            value.length == 2 &&
            state.value.toLowerCase().includes(value.toLowerCase())
        )
        // filter by state name
        .concat(
          US_STATES.filter(
            (state) => !state.value.toLowerCase().includes(value.toLowerCase())
          ).filter((state) => {
            const regex = new RegExp(value.split("").join(".*?"), "i");
            return regex.test(state.label);
          })
        )
        .reduce(
          (acc, item) => {
            if (!acc.find((i) => i.value === item.value)) {
              acc.push(item);
            }
            return acc;
          },
          [] as typeof US_STATES
        );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
  };

  const handleSelectState = (state: TUSState) => {
    setSelectedState(`${state.label} (${state.value})`);
    createOrderForm.setValue("state_code", state.value);
    setFilteredStates([]);
  };

  const [listServices, setListServices] = useState<Service[] | null>([]);
  const [listProducts, setListProducts] = useState<Product[] | null>([]);

  useEffect(() => {
    const fetchPackageService = async () => {
      try {
        const data = await getListServices();
        setListServices(data.services);
      } catch (error) {
        /* empty */
      }
    };

    const fetchProduct = async () => {
      try {
        const data = await getProductList();
        setListProducts(data.products);
      } catch (error) {
        /* empty */
      }
    };

    fetchPackageService();
    fetchProduct();
  }, []);

  const addProductForm = () => {
    const currentValues = createOrderForm.getValues();
    createOrderForm.setValue("package_products", [
      ...currentValues.package_products!,
      {},
    ]);
  };

  const removeProductForm = (index: number) => {
    const currentValues = createOrderForm.getValues();
    createOrderForm.setValue(
      "package_products",
      currentValues.package_products?.map((product, i) =>
        i === index ? null : product
      )
    );
  };

  const onSubmit = async (values: OrderFormSchemaType) => {
    values.country_code = "United States";
    //@ts-expect-error ts-such
    values.weight = Number(values.weight);
    //@ts-expect-error ts-such
    values.height = Number(values.height);
    //@ts-expect-error ts-such
    values.width = Number(values.width);
    //@ts-expect-error ts-such
    values.length = Number(values.length);
    //@ts-expect-error ts-such
    values.package_quantity = Number(values.package_quantity);
    //@ts-expect-error ts-such
    values.product_price = Number(values.product_price);

    const packageProducts = values.package_products?.map(
      (productFormData: any) => {
        const product = listProducts?.find(
          (e) => e.sku === productFormData?.sku
        );
        const quantity = productFormData?.quantity
          ? Number(productFormData?.quantity)
          : 1;

        if (product) {
          return {
            product_id: product!.id,
            quantity: quantity,
          };
        }
      }
    );

    values.package_products = packageProducts.filter(
      (item) => item !== undefined
    );

    setLoading(true);

    try {
      const result = await createPackage(values);
      console.log("Order created successfully:", result);
      toast.success("Order created successfully");
      modalClose();
      const { setPackages } = usePackageStore.getState();
      const newPackages = await getListPackages(
        1,
        50,
        "",
        "",
        undefined,
        undefined,
        undefined
      );
      setPackages(newPackages.packages);
    } catch (error) {
      console.error("Error creating order:", error);
      //@ts-expect-error expected
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const selectedService = createOrderForm.watch("service") || listServices?.[1]?.name;

  return (
    <div className="w-full px-2">
      <Heading title={"Tạo đơn hàng"} className="space-y-2 py-4 text-center" />
      <Form {...createOrderForm}>
        <form
          onSubmit={createOrderForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-x-8 max-md:grid-cols-1">
            <div className="border p-4 shadow-md">
              <strong className="">Thông tin người nhận</strong>
              <hr className="my-4" />
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 ">
                <FormField
                  control={createOrderForm.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên người nhận: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tên người nhận"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Số điện thoại"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="address_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Địa chỉ nhận hàng:{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Chỉ gồm tên đường số nhà"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="address_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ phụ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Địa chỉ phụ"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Thành phố: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Thành phố"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mã bưu điện: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mã bưu điện"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="state_code"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Bang: <span className="text-red-500">*</span>
                      </FormLabel>
                      <Input
                        className="mt-3 h-11 border rounded-sm focus:outline-none"
                        type="text"
                        value={selectedState}
                        onChange={handleInputChange}
                        placeholder="Nhập tên bang"
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          filteredStates.length > 0 &&
                          handleSelectState(filteredStates[0])
                        }
                      />
                      {filteredStates.length > 0 && (
                        <ul className="border border-gray-300 mt-1 p-0 list-none max-h-32 overflow-y-auto">
                          {filteredStates.map((state: TUSState) => (
                            <li
                              key={state.value}
                              onClick={() => handleSelectState(state)}
                              className="p-1 cursor-pointer"
                            >
                              {state.label} ({state.value})
                            </li>
                          ))}
                        </ul>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createOrderForm.control}
                  name="country_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quốc gia:</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="United States"
                          {...field}
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="border p-4 shadow-md">
              <strong className="">Thông tin đơn hàng</strong>
              <hr className="my-4" />
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                <FormField
                  control={createOrderForm.control}
                  name="detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Chi tiết sản phẩm:{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Chi tiết sản phẩm"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="order_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mã đơn hàng: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mã đơn hàng"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Trọng lượng: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="gram"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Dài: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="cm"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Rộng: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="cm"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cao: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="cm"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createOrderForm.control}
                  name="include_battery"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FormLabel>Hàng có pin</FormLabel>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex mt-10">
                <strong className="mr-2">
                  Dịch vụ gửi: <span className="text-red-500">*</span>
                </strong>
              </div>
              <FormField
                control={createOrderForm.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value?.toString() || listServices?.[1]?.name}
                        onValueChange={(value) => {
                          if (value) {
                            field.onChange(value);
                          }
                        }}
                      >
                        <SelectTrigger className="mb-4 box-border h-[48px] w-full px-[0.75rem] text-base leading-6">
                          <SelectValue placeholder="Dịch vụ" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea type="always" className="max-h-64">
                            {listServices?.map((service) => (
                              <SelectItem key={service.id} value={service.name}>
                                {service.name === "Saver"
                                  ? "Standard"
                                  : service.name}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedService === "Express (CN exclusive)" && (
                <>
                  <div className="flex mt-10">
                    <strong className="mr-2">Nhãn Trung Quốc:</strong>
                  </div>
                  <FormField
                    control={createOrderForm.control}
                    name="custom_cn_barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Mã nhãn"
                            {...field}
                            className="px-4 py-6 shadow-inner drop-shadow-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <div className="mt-5 border p-4 shadow-md">
              <div className="flex justify-between">
                <strong className="mr-2">Sản phẩm</strong>
                <button
                  type="button"
                  onClick={addProductForm}
                  className="p-2 bg-green-500 text-white rounded-full"
                >
                  <Plus />
                </button>
              </div>
              <hr className="my-4" />
              <div>
                {createOrderForm
                  .watch("package_products")!
                  .map(
                    (product, index) =>
                      !!product && (
                        <ProductForm
                          key={uniqueId("PrdForm")}
                          control={createOrderForm.control}
                          index={index}
                          product={listProducts}
                          onRemove={removeProductForm}
                        />
                      )
                  )}
              </div>
              <div className="flex gap-3 my-3">
                <FormField
                  control={createOrderForm.control}
                  name="package_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Package name: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          required={
                            !productValue ||
                            productValue.every(
                              (item) =>
                                !item ||
                                (typeof item === "object" &&
                                  Object.values(item).every((value) => !value))
                            )
                          }
                          type="text"
                          placeholder="Package name"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="package_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Package quantity:{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          required={
                            !productValue ||
                            productValue.every(
                              (item) =>
                                !item ||
                                (typeof item === "object" &&
                                  Object.values(item).every((value) => !value))
                            )
                          }
                          type="number"
                          placeholder="Package quantity"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createOrderForm.control}
                  name="product_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Product price: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          required={
                            !productValue ||
                            productValue.every(
                              (item) =>
                                !item ||
                                (typeof item === "object" &&
                                  Object.values(item).every((value) => !value))
                            )
                          }
                          type="number"
                          placeholder="Product price"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-5 border p-4 shadow-md">
              <div className="flex justify-between">
                <strong className="mr-2">Custom Label</strong>
              </div>
              <hr className="my-4" />
              <div className="flex border p-4 shadow-sm gap-x-8">
                <div className="flex-1 min-w-[25%]">
                  <FormField
                    control={createOrderForm.control}
                    name={`scan_days`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={(value) =>
                              handleSKUChange(field, value)
                            }
                          >
                            <SelectTrigger className="mb-4 box-border h-[48px] w-full px-[0.75rem] text-base leading-6">
                              <SelectValue placeholder="Scan days" />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea type="always" className="max-h-64">
                                <SelectItem value="1">1 day</SelectItem>
                                <SelectItem value="2">2 days</SelectItem>
                                <SelectItem value="3">3 days</SelectItem>
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1 min-w-[20%]">
                  <FormField
                    control={createOrderForm.control}
                    name={`custom_url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            required={!!scanDaysValue}
                            placeholder="url"
                            {...field}
                            className="px-4 py-6 shadow-inner drop-shadow-xl w-full"
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="">
              {/* <div className="total">
                <div className="total-title text-xs font-medium text-[#aaabab]">
                  Cước tạm tính:
                </div>
                <span className="total-number text-[28px] font-semibold leading-[34px] text-[#111212]">
                  $0.00
                </span>
              </div> */}
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                type="button"
                variant="secondary"
                className="rounded-full "
                size="lg"
                onClick={modalClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full"
                size="lg"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderCreateForm;
