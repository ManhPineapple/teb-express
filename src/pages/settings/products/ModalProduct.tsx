import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomAxios } from "@/utils/customAxios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().nonempty("Tên sản phẩm là bắt buộc"),
  sku: z.string().nonempty("SKU là bắt buộc"),
  detail: z.string().nonempty("Chi tiết là bắt buộc"),
  material: z.string().optional(),
  weight: z.number().min(1, "Trọng lượng phải lớn hơn 0"),
  country: z.string().nonempty("Quốc gia là bắt buộc"),
  length: z.number().min(1, "Chiều dài phải lớn hơn 0"),
  width: z.number().min(1, "Chiều rộng phải lớn hơn 0"),
  height: z.number().min(1, "Chiều cao phải lớn hơn 0"),
});

type ProductEdit = z.infer<typeof productSchema>;

const ModalAddOrUpdateProduct: React.FC<{
  product?: ProductEdit;
  updateId?: number;
}> = ({ product: initProduct, updateId: updateId }) => {
  const countries = ["US"];
  if (!initProduct)
    initProduct = {
      name: "",
      sku: "",
      detail: "",
      material: "",
      weight: 0,
      country: "",
      length: 0,
      width: 0,
      height: 0,
    };

  const [productEdit, setProductEdit] = useState<ProductEdit>(initProduct);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductEdit, string>>
  >({});

  const validateProduct = () => {
    try {
      productSchema.parse(productEdit);
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ProductEdit, string>> = {};
        e.errors.forEach((error) => {
          newErrors[error.path[0] as keyof ProductEdit] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductEdit((prev) => ({
      ...prev,
      [name]:
        name === "weight" ||
          name === "length" ||
          name === "width" ||
          name === "height"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSelectChange = (name: any, value: string) => {
    setProductEdit((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    if (validateProduct()) {
      try {
        if (!updateId) {
          const response = await CustomAxios.post(
            "/products/create",
            productEdit
          );
          if (response.status === 200)
            toast.success("Create product successfully!");
        } else {
          const response = await CustomAxios.put(
            `/products/${updateId}`,
            productEdit
          );
          if (response.status === 200)
            toast.success("Update product successfully!");
        }
        setTimeout(() => window.location.reload(), 1000);
      } catch (e: any) {
        toast.error(e.response.data || e.message);
      }
    }
  };

  return (
    <div className="modal__add-claim">
      <div className="p-modal">
        <div className="p-modal-body">
          <div className="mb-4">
            <label className="modal__add-claim-label">
              Tên sản phẩm: <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              className={`form-control ${errors.name ? "error-color" : ""}`}
              placeholder="Nhập tên sản phẩm"
              name="name"
              value={productEdit.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span className="err-span text-red-500">{errors.name}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="modal__add-claim-label">
              Mã SKU: <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              className={`form-control ${errors.sku ? "error-color" : ""}`}
              placeholder="Nhập mã SKU"
              name="sku"
              value={productEdit.sku}
              onChange={handleChange}
            />
            {errors.sku && (
              <span className="err-span text-red-500">{errors.sku}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="modal__add-claim-label">
              Loại sản phẩm: <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              className="form-control"
              placeholder="Nhập loại sản phẩm"
              name="detail"
              value={productEdit.detail}
              onChange={handleChange}
            />
            {errors.detail && (
              <span className="err-span text-red-500">{errors.detail}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="modal__add-claim-label">Chất liệu sản phẩm:</label>
            <Input
              type="text"
              className="form-control"
              placeholder="Nhập chất liệu sản phẩm"
              name="material"
              value={productEdit.material}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="modal__add-claim-label">
              Trọng lượng: <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              className={`form-control ${errors.weight ? "error-color" : ""}`}
              placeholder="gram"
              name="weight"
              value={
                productEdit.weight !== undefined
                  ? productEdit.weight.toString()
                  : ""
              }
              onChange={handleChange}
            />
            {errors.weight && (
              <span className="err-span text-red-500">{errors.weight}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="modal__add-claim-label">
              Quốc gia: <span className="text-red-500">*</span>
            </label>
            <Select
              onValueChange={(value) => handleSelectChange("country", value)}
            >
              <SelectTrigger className="w-full border p-2 rounded-md">
                <SelectValue placeholder="Chọn quốc gia" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {countries.map((country, index) => (
                    <SelectItem key={index} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.country && (
              <span className="err-span text-red-500">{errors.country}</span>
            )}
          </div>

          <div className="mb-4 grid grid-cols-3 gap-4">
            <div>
              <label className="modal__add-claim-label">
                Chiều dài: <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                className={`form-control ${errors.length ? "error-color" : ""}`}
                placeholder="cm"
                name="length"
                value={
                  productEdit.length !== undefined
                    ? productEdit.length.toString()
                    : ""
                }
                onChange={handleChange}
              />
              {errors.length && (
                <span className="err-span text-red-500">{errors.length}</span>
              )}
            </div>

            <div>
              <label className="modal__add-claim-label">
                Chiều rộng: <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                className={`form-control ${errors.width ? "error-color" : ""}`}
                placeholder="cm"
                name="width"
                value={
                  productEdit.width !== undefined
                    ? productEdit.width.toString()
                    : ""
                }
                onChange={handleChange}
              />
              {errors.width && (
                <span className="err-span text-red-500">{errors.width}</span>
              )}
            </div>

            <div>
              <label className="modal__add-claim-label">
                Chiều cao: <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                className={`form-control ${errors.height ? "error-color" : ""}`}
                placeholder="cm"
                name="height"
                value={
                  productEdit.height !== undefined
                    ? productEdit.height.toString()
                    : ""
                }
                onChange={handleChange}
              />
              {errors.height && (
                <span className="err-span text-red-500">{errors.height}</span>
              )}
            </div>
          </div>
        </div>
        <div className="p-modal-footer flex justify-end space-x-4">
          <Button className="btn btn-default" variant="outline">
            Hủy
          </Button>
          <Button onClick={onSave} className="btn btn-primary">
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );

};

export default ModalAddOrUpdateProduct;
