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
import {
  createPackage,
  getListPackages,
  uploadImage,
} from "@/services/packages";
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

type OrderFormSchemaType = z.infer<typeof orderFormSchema>;

type ProductFormProps = {
  form: any;
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
  price: number;
};

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  index,
  product,
  onRemove,
}) => {
  const handleSKUChange = (field: any, value: string) => {
    const selectedProduct = product?.find((pd) => pd.sku === value);
    const newName = selectedProduct?.name || "";

    field.onChange(value);
    form.setValue(`package_products[${index}].name`, newName);
  };

  return (
    <div className="flex border p-4 shadow-sm">
      <div className="flex-1 min-w-[25%]">
        <FormField
          control={form.control}
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
          control={form.control}
          name={`package_products[${index}].name`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled
                  placeholder="Tên sản phẩm"
                  className="px-4 py-6 shadow-inner drop-shadow-xl bg-gray-300 w-full truncate"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex-1 min-w-[20%]">
        <FormField
          control={form.control}
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

import axios from "axios";
import { useWatch } from "react-hook-form";
import { orderFormSchema } from "../package_schema";

const OrderCreateForm = ({
  modalClose,
  packageListType,
}: {
  modalClose: () => void;
  packageListType: number;
}) => {
  const [selectedState, setSelectedState] = useState("");
  const [filteredStates, setFilteredStates] = useState<TUSState[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cnPackageType, setCnPackageType] = useState<string>("Purchased");
  const [listServices, setListServices] = useState<Service[] | null>([]);
  const [listProducts, setListProducts] = useState<Product[] | null>([]);
  const [productPriceInput, setProductPriceInput] = useState("");
  const [shippingFeeInput, setShippingFee] = useState("");
  const [currency, setCurrency] = useState("CNY");
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({
    VND: 0.000039,
    CNY: 0.14,
    USD: 1,
  }); // default value

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

    const getCurrencyRate = async () => {
      const today = new Date().toISOString().split("T")[0];
      axios
        .get(`https://www.vietcombank.com.vn/api/exchangerates?date=${today}`)
        .then((response) => {
          const data = response.data.Data;
          const usdRate =
            data.find((item: any) => item.currencyCode === "USD")?.sell ?? 1;
          const cnyRate =
            data.find((item: any) => item.currencyCode === "CNY")?.sell ?? 1;

          setCurrencyRates({
            VND: 1 / usdRate,
            CNY: cnyRate / usdRate,
            USD: 1,
          });
        })
        .catch((error) => {
          console.error("Error fetching exchange rate:", error);
        });
    };

    fetchPackageService();
    fetchProduct();
    getCurrencyRate();
  }, []);

  const createOrderForm = useForm<OrderFormSchemaType>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      service: listServices?.[packageListType]?.name,
      package_products: [{}],
    },
  });

  useEffect(() => {
    if (listServices && packageListType in listServices) {
      createOrderForm.setValue("service", listServices[packageListType].name);
    }
  }, [createOrderForm, listServices, packageListType]);

  const productValue = useWatch({
    control: createOrderForm.control,
    name: `package_products`,
  });

  const handleChooseStateInputChange = (event: any) => {
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
      currentValues.package_products?.filter((_, i) => i !== index) || []
    );
  };

  const onSubmit = async (values: any) => {
    const numericFields = [
      "weight",
      "height",
      "width",
      "length",
      "package_quantity",
      "product_price",
      "cn_product_price",
      "cn_shipping_fee",
    ];

    numericFields.forEach((field) => {
      values[field] = Number(values[field]);
    });
    values.country_code = "United States";

    let packageQuantity = 0;
    let totalProductPrice = 0;
    const packageProducts = values.package_products
      ?.map(({ sku, quantity }: any) => {
        const product = listProducts?.find((p) => p.sku === sku);
        const qty = Number(quantity) || 1;

        if (product) {
          packageQuantity += qty;
          totalProductPrice += product.price * qty;

          return { product_id: product.id, quantity: qty };
        }
        return null;
      })
      .filter(Boolean);

    if (values.service === "Express (CN exclusive)") {
      values.is_purchased = cnPackageType === "Pre-purchased" ? false : true;
    }
    if (selectedService === "Warehouse Stock") {
      if (packageQuantity == 0) {
        toast.error("Cần bổ sung ít nhất 1 sản phẩm");
        return;
      }
      values = {
        ...values,
        package_name: values.detail,
        package_quantity: packageQuantity,
        product_price: totalProductPrice,
        package_products: packageProducts,
      };
    } else {
      values.package_products = null;
    }

    setLoading(true);

    try {
      if (values.image) {
        const uploadUrl = await uploadImage(values.image);
        values = {
          ...values,
          image_upload: uploadUrl,
        };
      }

      await createPackage(values);
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
      toast.error(error.response.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedService =
    createOrderForm.watch("service") || listServices?.[packageListType]?.name;
  const hasTiktokLabel = createOrderForm.watch("has_tiktok_label");

  useEffect(() => {
    if (!isNaN(Number(shippingFeeInput)) && shippingFeeInput !== "") {
      createOrderForm.setValue(
        "cn_shipping_fee",
        (Number(shippingFeeInput) * currencyRates[currency]).toFixed(2)
      );
    } else {
      createOrderForm.setValue("cn_shipping_fee", "");
    }
  }, [shippingFeeInput, currency]);

  useEffect(() => {
    if (!isNaN(Number(productPriceInput)) && productPriceInput !== "") {
      createOrderForm.setValue(
        "cn_product_price",
        (Number(productPriceInput) * currencyRates[currency]).toFixed(2)
      );
    } else {
      createOrderForm.setValue("cn_product_price", "");
    }
  }, [productPriceInput, currency]);

  const handleAmountChange = (e: any, type: string) => {
    const value = e.target.value;
    if (type === "productPrice") {
      setProductPriceInput(value);
    } else if (type === "shippingFee") {
      setShippingFee(value);
    }
    setLoading(true);

    if (debounceTimer) clearTimeout(debounceTimer);

    const newTimer = setTimeout(() => {
      if (type === "productPrice") {
        createOrderForm.setValue(
          "cn_product_price",
          (value * currencyRates[currency]).toFixed(2)
        );
      } else if (type === "shippingFee") {
        createOrderForm.setValue(
          "cn_shipping_fee",
          (value * currencyRates[currency]).toFixed(2)
        );
      }

      setLoading(false);
    }, 1000);

    setDebounceTimer(newTimer);
  };

  return (
    <div className="w-full px-2">
      <Heading title={"Tạo đơn hàng"} className="space-y-2 py-4 text-center" />
      <Form {...createOrderForm}>
        <form
          onSubmit={createOrderForm.handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
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
                        Tên người nhận:{" "}
                        {selectedService !== "Ship by Tiktok" &&
                          !hasTiktokLabel && (
                            <span className="text-red-500">*</span>
                          )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tên người nhận"
                          {...field}
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
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
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
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
                        {selectedService !== "Ship by Tiktok" &&
                          !hasTiktokLabel && (
                            <span className="text-red-500">*</span>
                          )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Chỉ gồm tên đường số nhà"
                          {...field}
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
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
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
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
                        Thành phố:{" "}
                        {selectedService !== "Ship by Tiktok" &&
                          !hasTiktokLabel && (
                            <span className="text-red-500">*</span>
                          )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Thành phố"
                          {...field}
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
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
                        Mã bưu điện:{" "}
                        {selectedService !== "Ship by Tiktok" &&
                          !hasTiktokLabel && (
                            <span className="text-red-500">*</span>
                          )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mã bưu điện"
                          {...field}
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
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
                        Bang:{" "}
                        {selectedService !== "Ship by Tiktok" &&
                          !hasTiktokLabel && (
                            <span className="text-red-500">*</span>
                          )}
                      </FormLabel>
                      <Input
                        className="mt-3 h-11 border rounded-sm focus:outline-none"
                        type="text"
                        value={selectedState}
                        onChange={handleChooseStateInputChange}
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
                        Trọng lượng:{" "}
                        {selectedService !== "Express (CN exclusive)" && (
                          <span className="text-red-500">*</span>
                        )}
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
                        Dài:{" "}
                        {selectedService !== "Express (CN exclusive)" && (
                          <span className="text-red-500">*</span>
                        )}
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
                        Rộng:{" "}
                        {selectedService !== "Express (CN exclusive)" && (
                          <span className="text-red-500">*</span>
                        )}
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
                        Cao:{" "}
                        {selectedService !== "Express (CN exclusive)" && (
                          <span className="text-red-500">*</span>
                        )}
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
                        value={field.value?.toString()}
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
                  <Select
                    defaultValue={cnPackageType}
                    onValueChange={(value) => {
                      if (value) {
                        setCnPackageType(value);
                      }
                    }}
                  >
                    <SelectTrigger className="mb-4 box-border h-[48px] w-full px-[0.75rem] text-base leading-6">
                      <SelectValue placeholder="Dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea type="always" className="max-h-64">
                        <SelectItem
                          key={"Pre-purchased"}
                          value={"Pre-purchased"}
                        >
                          Hàng nhờ mua
                        </SelectItem>
                        <SelectItem key={"Purchased"} value={"Purchased"}>
                          Hàng đã mua
                        </SelectItem>
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </>
              )}
              {selectedService !== "Ship by Tiktok" && (
                <FormField
                  control={createOrderForm.control}
                  name="has_tiktok_label"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2 my-4">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FormLabel>
                            Dùng mã tiktok riêng (Ship by Tiktok)
                          </FormLabel>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {(selectedService === "Ship by Tiktok" || hasTiktokLabel) && (
                <>
                  <div className="flex justify-between">
                    <strong className="mr-2">
                      Link nhãn Tiktok <span className="text-red-500">*</span>
                    </strong>
                  </div>
                  <FormField
                    control={createOrderForm.control}
                    name={`custom_tiktok_barcode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Link nhãn"
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
                  <FormField
                    control={createOrderForm.control}
                    name="is_early_scan"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2 mt-4">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <FormLabel>Scan tiktok sớm</FormLabel>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {selectedService === "Express (CN exclusive)" && (
                <>
                  {cnPackageType == "Pre-purchased" && (
                    <>
                      <div className="flex mt-10">
                        <strong className="mr-2">Link sản phẩm</strong>
                      </div>
                      <FormField
                        control={createOrderForm.control}
                        name="cn_product_link"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Link sản phẩm"
                                {...field}
                                className="px-4 py-6 shadow-inner drop-shadow-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex mt-10">
                        <strong className="mr-2">Giá sản phẩm</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Currency Selection & Input */}
                        <div className="relative flex">
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="mr-2 px-2 py-2 border rounded bg-white shadow-inner"
                          >
                            <option value="VND">₫</option>
                            <option value="CNY">¥</option>
                            <option value="USD">$</option>
                          </select>
                          <input
                            type="number"
                            value={productPriceInput}
                            onChange={(e) =>
                              handleAmountChange(e, "productPrice")
                            }
                            placeholder="Giá sản phẩm trên web"
                            className="w-full px-4 py-2 border rounded shadow-inner"
                          />
                        </div>

                        <FormField
                          control={createOrderForm.control}
                          name="cn_product_price"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    $
                                  </span>
                                  <Input
                                    type="number"
                                    {...field}
                                    placeholder="USD tự động cập nhật"
                                    disabled
                                    className="w-full pl-7 pr-4 py-2 border rounded shadow-inner bg-gray-200 cursor-not-allowed"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {cnPackageType == "Purchased" && (
                    <>
                      <div className="flex mt-10">
                        <strong className="mr-2">
                          Giá ship nội địa (nhờ trả)
                        </strong>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Currency Selection & Input */}
                        <div className="relative flex">
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="mr-2 px-2 py-2 border rounded bg-white shadow-inner"
                          >
                            <option value="VND">₫</option>
                            <option value="CNY">¥</option>
                            <option value="USD">$</option>
                          </select>
                          <input
                            type="number"
                            value={shippingFeeInput}
                            onChange={(e) =>
                              handleAmountChange(e, "shippingFee")
                            }
                            placeholder="Nhập số tiền"
                            className="w-full px-4 py-2 border rounded shadow-inner"
                          />
                        </div>

                        <FormField
                          control={createOrderForm.control}
                          name="cn_shipping_fee"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    $
                                  </span>
                                  <Input
                                    type="number"
                                    {...field}
                                    placeholder="USD tự động cập nhật"
                                    disabled
                                    className="w-full pl-7 pr-4 py-2 border rounded shadow-inner bg-gray-200 cursor-not-allowed"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                  <div className="flex mt-10">
                    <strong className="mr-2">Ảnh biên nhận</strong>
                  </div>
                  <FormField
                    control={createOrderForm.control}
                    name="image"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                onChange(e.target.files[0]);
                              }
                            }}
                            className="px-4 pt-2 shadow-inner drop-shadow-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex mt-10">
                    <strong className="mr-2">Ảnh sản phẩm:</strong>
                  </div>
                  <FormField
                    control={createOrderForm.control}
                    name="cn_product_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Link ảnh"
                            {...field}
                            className="px-4 py-6 shadow-inner drop-shadow-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex mt-10">
                    <strong className="mr-2">Ghi chú thêm:</strong>
                  </div>
                  <FormField
                    control={createOrderForm.control}
                    name="cn_note"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Bất cứ lưu ý cho sản phẩm"
                            {...field}
                            className="px-4 py-6 shadow-inner drop-shadow-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
              {selectedService === "Warehouse Stock" && (
                <>
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
                              form={createOrderForm}
                              index={index}
                              product={listProducts}
                              onRemove={removeProductForm}
                            />
                          )
                      )}
                  </div>
                </>
              )}
              {selectedService !== "Warehouse Stock" && (
                <>
                  <div className="flex justify-between">
                    <strong className="mr-2">Sản phẩm</strong>
                  </div>
                  <hr className="my-4" />
                  <div className="flex gap-3 my-3">
                    <FormField
                      control={createOrderForm.control}
                      name="package_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tên đơn hàng:{" "}
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
                                      Object.values(item).every(
                                        (value) => !value
                                      ))
                                )
                              }
                              type="text"
                              placeholder="Tên đơn hàng"
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
                            Số lượng sản phẩm:{" "}
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
                                      Object.values(item).every(
                                        (value) => !value
                                      ))
                                )
                              }
                              type="number"
                              placeholder="Số lượng"
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
                            Giá sản phẩm:{" "}
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
                                      Object.values(item).every(
                                        (value) => !value
                                      ))
                                )
                              }
                              type="number"
                              placeholder="Giá sản phẩm"
                              {...field}
                              className=" px-4 py-6 shadow-inner drop-shadow-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
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
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full"
                size="lg"
              >
                {loading ? "Đang xử lý..." : "Lưu"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderCreateForm;
