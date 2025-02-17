import React, { useState } from "react";
import axios from "axios";
import { z } from "zod";

// Define Zod schema for validation with string inputs and custom refinement
const packageSchema = z.object({
  weight: z
    .string()
    .min(1, { message: "Weight is required" })
    .refine((val) => parseFloat(val) > 0, {
      message: "Weight must be greater than 0",
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
});

const CostEstimator = () => {
  const [formData, setFormData] = useState({
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const [calculatedFee, setCalculatedFee] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<any>({
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calculate cost
  const calculateCost = async () => {
    setFormErrors({
      weight: "",
      length: "",
      width: "",
      height: "",
    }); // Clear any previous errors

    // Validate the form data
    const result = packageSchema.safeParse(formData);

    if (!result.success) {
      // Handle validation errors for each field
      const errors: any = {};
      result.error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      // Construct the payload
      const payload = {
        service: "Express",
        recipient: "Homepage",
        phone: "",
        address_1: "47 W 13th St",
        city: "New York",
        state_code: "NY",
        country_code: "United States",
        detail: "homepage",
        zipcode: "10011",
        order_number: "homepage",
        weight: parseFloat(formData.weight),
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        package_products: [],
      };

      // Make the API request
      const response = await axios.post(
        "https://api.ananbay.com/v1/shipment/packages/public-package-fee",
        payload
      );

      // Update the fee
      setCalculatedFee(response.data.shipping_fee);
    } catch (err) {
      setFormErrors({
        ...formErrors,
        general: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row p-6 bg-white shadow-lg rounded-lg px-4 mt-10">
      <div className="flex-1 p-4">
        <h2 className="text-[34px] font-normal tracking-[-0.02em] mb-4">
          Ước tính chi phí
        </h2>
        <p className="mb-4">
          Vui lòng nhập các thông tin sau đây để ước tính chi phí vận chuyển đơn
          hàng của bạn
        </p>

        <label className="block mb-2">
          Trọng lượng <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="weight"
          placeholder="gram"
          value={formData.weight}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        />
        {formErrors.weight && (
          <div className="text-red-600 text-xs">{formErrors.weight}</div>
        )}

        <div className="flex justify-between gap-3">
          <div>
            <label className="block mb-2">
              Dài <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="length"
              placeholder="cm"
              value={formData.length}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            {formErrors.length && (
              <div className="text-red-600 text-xs">{formErrors.length}</div>
            )}
          </div>
          <div>
            <label className="block mb-2">
              Rộng <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="width"
              placeholder="cm"
              value={formData.width}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            {formErrors.width && (
              <div className="text-red-600 text-xs">{formErrors.width}</div>
            )}
          </div>
          <div>
            <label className="block mb-2">
              Cao <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="height"
              placeholder="cm"
              value={formData.height}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            {formErrors.height && (
              <div className="text-red-600 text-xs">{formErrors.height}</div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <div>
            <div className="text-xs text-gray-400">Cước tạm tính:</div>
            <div>
              <strong>
                {calculatedFee !== null ? `$${calculatedFee}` : "$0"}
              </strong>
            </div>
            <div className="font-normal text-[14px] leading-[20px] text-[#868689] mt-3">
              Cước tính chỉ mang tính chất tham khảo
            </div>
            {formErrors.general && (
              <div className="text-red-600 text-xs">{formErrors.general}</div>
            )}
          </div>
          <button
            onClick={calculateCost}
            className="px-8 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight"
          >
            Tính giá
          </button>
        </div>
      </div>
      <div className="flex-1">
        <img
          src="https://thehuman.express/img/plane.webp"
          alt="Shipping"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default CostEstimator;
