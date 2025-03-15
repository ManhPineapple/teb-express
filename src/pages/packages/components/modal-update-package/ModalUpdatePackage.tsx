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
import { updatePackages, uploadCnInvoiceImage } from "@/services/packages";
import { getListServices } from "@/services/settings/price";
import { getProductList } from "@/services/settings/products";
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

import axios from "axios";
import { useWatch } from "react-hook-form";
import { PackageDetail } from "../../package_china/PackageDetail";
import { orderFormSchema } from "../modal-create-package/order-form-schema";
type PackageDetailProps = {
  modalClose: () => void;
  packageDetail: PackageDetail;
  packageListType: number;
};

const ModalUpdatePackage = ({
  modalClose,
  packageDetail,
  packageListType,
}: PackageDetailProps) => {
  const [selectedState, setSelectedState] = useState(packageDetail.state_code);
  const [filteredStates, setFilteredStates] = useState<TUSState[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const defaultTab =
    packageDetail.status_string === "purchased" ? "Purchased" : "Pre-purchased";
  const defaultCnPackageType =
    packageDetail.is_purchased == true ? "Purchased" : "Pre-purchased";
  const [cnPackageType] = useState<string>(defaultCnPackageType);
  const [cnPackageTab] = useState<string>(defaultTab);
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

  const updatePackageForm = useForm<OrderFormSchemaType>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      service: packageDetail.service_name,
      recipient: packageDetail.recipient,
      phone: packageDetail.phone_number,
      address_1: packageDetail.address_1,
      address_2: packageDetail.address_2,
      city: packageDetail.city,
      state_code: packageDetail.state_code,
      country_code: packageDetail.country_code,
      detail: packageDetail.detail,
      zipcode: packageDetail.zipcode,
      order_number: packageDetail.order_number,
      weight: packageDetail.weight.toString(),
      length: packageDetail.length.toString(),
      width: packageDetail.width.toString(),
      height: packageDetail.height.toString(),
      include_battery: packageDetail.include_battery || false,
      package_products: packageDetail.package_products || [{}],
      scan_days: packageDetail.scan_days,
      custom_url: packageDetail.custom_url,
      package_name: packageDetail.package_name,
      package_quantity: (packageDetail.package_quantity || 0).toString(),
      product_price: (packageDetail.product_price || 0).toString(),
      custom_cn_barcode: packageDetail.custom_cn_barcode || "",
      cn_product_link: packageDetail.cn_product_link || "",
      cn_product_price: packageDetail.cn_product_price?.toString(),
      cn_shipping_fee: packageDetail.cn_shipping_fee?.toString(),
    },
  });

  useEffect(() => {
    if (listServices && packageListType in listServices) {
      updatePackageForm.setValue("service", listServices[packageListType].name);
    }
  }, [updatePackageForm, listServices, packageListType]);

  const productValue = useWatch({
    control: updatePackageForm.control,
    name: `package_products`,
  });

  const scanDaysValue = useWatch({
    control: updatePackageForm.control,
    name: `scan_days`,
  });

  const handleSKUChange = (field: any, value: string) => {
    field.onChange(value);
  };

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
    updatePackageForm.setValue("state_code", state.value);
    setFilteredStates([]);
  };

  const addProductForm = () => {
    const currentValues = updatePackageForm.getValues();
    updatePackageForm.setValue("package_products", [
      ...currentValues.package_products!,
      {},
    ]);
  };

  const removeProductForm = (index: number) => {
    const currentValues = updatePackageForm.getValues();
    updatePackageForm.setValue(
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
    //@ts-expect-error ts-such
    values.cn_product_price = Number(values.cn_product_price);
    //@ts-expect-error ts-such
    values.cn_shipping_fee = Number(values.cn_shipping_fee);

    if (values.cn_product_link == "") values.cn_product_link = undefined;
    if (values.custom_cn_barcode == "") values.custom_cn_barcode = undefined;

    if (values.service == "Express (CN exclusive)") {
      if (cnPackageType == "Purchased") {
        values.is_purchased = true;
      } else if (cnPackageType == "Pre-purchased") {
        values.is_purchased = false;
      } else {
        // default cnPackageType value is purchased
        values.is_purchased = true;
      }
    }

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

    values.package_products = packageProducts?.filter(
      (item) => item !== undefined
    );

    setLoading(true);

    try {
      if (values.image) {
        const uploadUrl = await uploadCnInvoiceImage(values.image);
        values = {
          ...values,
          cn_invoice_image: uploadUrl,
        };
      }
      await updatePackages(packageDetail.id, values);
      toast.success("Order updated successfully");
      modalClose();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error creating order:", error);
      //@ts-expect-error expected
      toast.error(error.response.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedService =
    updatePackageForm.watch("service") || listServices?.[packageListType]?.name;

  useEffect(() => {
    if (!isNaN(Number(productPriceInput)) && productPriceInput !== "") {
      updatePackageForm.setValue(
        "cn_product_price",
        (Number(productPriceInput) * currencyRates[currency]).toFixed(2)
      );
    } else {
      updatePackageForm.setValue("cn_product_price", "");
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
        updatePackageForm.setValue(
          "cn_product_price",
          (value * currencyRates[currency]).toFixed(2)
        );
      } else if (type === "shippingFee") {
        updatePackageForm.setValue(
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
      <Heading
        title={"Sửa thông tin đơn hàng"}
        className="space-y-2 py-4 text-center"
      />
      <Form {...updatePackageForm}>
        <form
          onSubmit={updatePackageForm.handleSubmit(onSubmit, (err) => {
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                  control={updatePackageForm.control}
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
                control={updatePackageForm.control}
                name="service"
                disabled={true}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select value={field.value?.toString()} disabled={true}>
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
                  <Select defaultValue={cnPackageType} disabled>
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

                  {cnPackageTab == "Pre-purchased" && (
                    <>
                      <div className="flex mt-10">
                        <strong className="mr-2">Link sản phẩm</strong>
                      </div>
                      <FormField
                        control={updatePackageForm.control}
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
                          control={updatePackageForm.control}
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

                  {cnPackageTab == "Purchased" && (
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
                          control={updatePackageForm.control}
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
                      <div className="flex mt-10">
                        <strong className="mr-2">Ảnh biên nhận</strong>
                      </div>
                      <FormField
                        control={updatePackageForm.control}
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
                        <strong className="mr-2">Nhãn Trung Quốc:</strong>
                      </div>
                      <FormField
                        control={updatePackageForm.control}
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
                {updatePackageForm
                  .watch("package_products")!
                  .map(
                    (product, index) =>
                      !!product && (
                        <ProductForm
                          key={uniqueId("PrdForm")}
                          control={updatePackageForm.control}
                          index={index}
                          product={listProducts}
                          onRemove={removeProductForm}
                        />
                      )
                  )}
              </div>
              <div className="flex gap-3 my-3">
                <FormField
                  control={updatePackageForm.control}
                  name="package_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên đơn hàng: <span className="text-red-500">*</span>
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
                  control={updatePackageForm.control}
                  name="package_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Số lượng đơn hàng:{" "}
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
                          placeholder="Số lượng đơn hàng"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updatePackageForm.control}
                  name="product_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Giá sản phẩm: <span className="text-red-500">*</span>
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
            </div>
            <div className="mt-5 border p-4 shadow-md">
              <div className="flex justify-between">
                <strong className="mr-2">Tùy chỉnh nhãn</strong>
              </div>
              <hr className="my-4" />
              <div className="flex border p-4 shadow-sm gap-x-8">
                <div className="flex-1 min-w-[25%]">
                  <FormField
                    control={updatePackageForm.control}
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
                              <SelectValue placeholder="Ngày quét" />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea type="always" className="max-h-64">
                                <SelectItem value="1">1 ngày</SelectItem>
                                <SelectItem value="2">2 ngày</SelectItem>
                                <SelectItem value="3">3 ngày</SelectItem>
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
                    control={updatePackageForm.control}
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

export default ModalUpdatePackage;
