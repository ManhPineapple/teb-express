import Heading from "@/components/shared/heading";
import { Button } from "@/components/ui/button";
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
import { updatePackages } from "@/services/packages";
import { getListServices } from "@/services/settings/price";
import { getProductList } from "@/services/settings/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { uniqueId } from "lodash";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";

const orderFormSchema = z.object({
  service: z.string().min(1, { message: "Service is required" }),
  recipient: z.string().min(1, { message: "Recipient is required" }),
  phone: z.string().optional(),
  address_1: z.string().min(1, { message: "Address is required" }),
  address_2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  state_code: z.string().min(1, { message: "State code is required" }),
  country_code: z.string().min(1, { message: "Country code is required" }),
  detail: z.string().min(1, { message: "Detail is required" }),
  zipcode: z.string().min(1, { message: "Zip code is required" }),
  order_number: z.string().min(1, { message: "Order number is required" }),
  weight: z.string(),
  length: z.string().min(1, { message: "Length must be greater than 0" }),
  width: z.string().min(1, { message: "Width must be greater than 0" }),
  height: z.string().min(1, { message: "Height must be greater than 0" }),
  include_battery: z.boolean().optional(),
  package_products: z.array(z.any()).optional(),
  scan_days: z.string().optional(),
  custom_url: z.string().optional(),
  package_name: z.string().optional(),
  package_quantity: z.number().optional(),
  product_price: z.number().optional(),
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
                  placeholder="Số lượng"
                  type="number"
                  defaultValue={1}
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
import { PackageDetail } from "../../PackageDetail";

const CustomLabel: React.FC<ProductFormProps> = ({
  control,
  index,
  product,
  onRemove,
}) => {
  const scanDaysValue = useWatch({
    control,
    name: `scan_days`,
  });

  const handleSKUChange = (field: any, value: string) => {
    field.onChange(value);
  };

  return (
    <div className="flex border p-4 shadow-sm gap-x-8">
      <div className="flex-1 min-w-[25%]">
        <FormField
          control={control}
          name={`scan_days`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => handleSKUChange(field, value)}
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
          control={control}
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
  );
};

type PackageDetailProps = {
  modalClose: () => void;
  packageDetail: PackageDetail;
};

const ModalUpdatePackages = ({
  modalClose,
  packageDetail,
}: PackageDetailProps) => {
  const form = useForm<OrderFormSchemaType>({
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
      package_quantity: packageDetail.package_quantity || 0,
      product_price: packageDetail.product_price || 0,
      custom_cn_barcode: packageDetail.custom_cn_barcode,
    },
  });

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

  const onSubmit = async (values: OrderFormSchemaType) => {
    //@ts-expect-error ts-such
    values.weight = Number(values.weight);
    //@ts-expect-error ts-such
    values.height = Number(values.height);
    //@ts-expect-error ts-such
    values.width = Number(values.width);
    //@ts-expect-error ts-such
    values.length = Number(values.length);
    values.package_quantity = Number(values.package_quantity);
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
    try {
      const result = await updatePackages(packageDetail.id, values);
      console.log("Package updated successfully:", result);
      toast.success("Order updated successfully");
      modalClose();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error updating package:", error);
      // @ts-expect-error error is expected
      toast.error(error.response.data.error || error.response.statusText);
    }
  };

  const addProductForm = () => {
    const currentValues = form.getValues();
    form.setValue("package_products", [...currentValues.package_products!, {}]);
  };

  const removeProductForm = (index: number) => {
    const currentValues = form.getValues();
    form.setValue(
      "package_products",
      currentValues.package_products?.map((product, i) =>
        i === index ? null : product
      )
    );
  };

  const scanDaysValue = useWatch({
    control: form.control,
    name: `scan_days`,
  });

  const handleSKUChange = (field: any, value: string) => {
    field.onChange(value);
  };

  const productValue = useWatch({
    control: form.control,
    name: `package_products`,
  });

  const selectedService = form.watch("service");

  return (
    <div className="w-full px-2">
      <Heading title={"Update Order"} className="space-y-2 py-4 text-center" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-x-8 max-md:grid-cols-1">
            <div className="border p-4 shadow-md">
              <strong className="">Thông tin người nhận</strong>
              <hr className="my-4" />
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 ">
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
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
                                <SelectItem
                                  key={service.id}
                                  value={service.name}
                                >
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

                <FormField
                  control={form.control}
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
                {/* <FormField
                  control={form.control}
                  name="invoiceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên hóa đơn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tên hóa đơn"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
                  name="address_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address 2</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="address"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Thành phố: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="thành phố"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mã bưu điện: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="mã bưu điện"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Bang: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="bang"
                          {...field}
                          className=" px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Quốc gia: <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="quốc gia"
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

            <div className="border p-4 shadow-md">
              <strong className="">Thông tin đơn hàng</strong>
              <hr className="my-4" />
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                {selectedService === "Express (CN exclusive)" && (
                  <>
                    <FormField
                      control={form.control}
                      name="custom_cn_barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nhãn Trung Quốc:</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Nhãn Trung Quốc"
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
            </div>
          </div>
          <div className="border p-4 shadow-md">
            <div className="flex">
              <strong className="mr-2">Sản phẩm</strong>
              <button onClick={addProductForm} type="button">
                <CirclePlus />
              </button>
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              {/* {form.watch("package_products")?.map((_, index: number) => (
                <ProductForm
                  key={uniqueId("PrdForm")}
                  index={index}
                  product={listProducts}
                  control={form.control}
                  onRemove={removeProductForm}
                />
              ))} */}
              {form
                .watch("package_products")!
                .map(
                  (product, index) =>
                    !!product && (
                      <ProductForm
                        key={uniqueId("PrdForm")}
                        control={form.control}
                        index={index}
                        product={listProducts}
                        onRemove={removeProductForm}
                      />
                    )
                )}
            </div>
            <div className="flex gap-3 my-3">
              <FormField
                control={form.control}
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
                control={form.control}
                name="package_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Package quantity: <span className="text-red-500">*</span>
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
                control={form.control}
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
            {/* <div>
              {form
                .watch("package_products")!
                .map(
                  (product, index) =>
                    !!product && (
                      <CustomLabel
                        control={form.control}
                        index={index}
                        product={listProducts}
                        onRemove={removeProductForm}
                      />
                    )
                )}
            </div> */}
            <div className="flex border p-4 shadow-sm gap-x-8">
              <div className="flex-1 min-w-[25%]">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
          <div className="flex justify-between">
            <div className="">
              <div className="total">
                <div className="total-title text-xs font-medium text-[#aaabab]">
                  Cước tạm tính:
                </div>
                <span className="total-number text-[28px] font-semibold leading-[34px] text-[#111212]">
                  $0.00
                </span>
              </div>
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
              <Button type="submit" className="rounded-full" size="lg">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ModalUpdatePackages;
