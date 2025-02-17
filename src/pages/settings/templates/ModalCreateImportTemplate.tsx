import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  templateName: z.string().min(1, { message: "Template name is required" }),
  file: z.any(),
  recipientName: z.string().min(1, { message: "Recipient name is required" }),
  recipientPhone: z.string().min(1, { message: "Recipient phone is required" }),
  recipientAddress: z
    .string()
    .min(1, { message: "Recipient address is required" }),
  recipientCity: z.string().min(1, { message: "City is required" }),
  recipientZip: z.string().min(1, { message: "Zip code is required" }),
});

type FormData = z.infer<typeof schema>;

const ImportTemplateForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">Tạo một Import Template</h2>

        <label className="block mb-2">
          Tên template:
          <input
            {...register("templateName")}
            className="block w-full p-2 border rounded mt-1"
          />
          {errors.templateName && (
            <span className="text-red-500">{errors.templateName.message}</span>
          )}
        </label>

        <label className="block mb-2">
          File template:
          <input
            type="file"
            {...register("file")}
            className="block w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Tên người nhận:
          <input
            {...register("recipientName")}
            className="block w-full p-2 border rounded mt-1"
          />
          {errors.recipientName && (
            <span className="text-red-500">{errors.recipientName.message}</span>
          )}
        </label>

        <label className="block mb-2">
          Số điện thoại người nhận:
          <input
            {...register("recipientPhone")}
            className="block w-full p-2 border rounded mt-1"
          />
          {errors.recipientPhone && (
            <span className="text-red-500">
              {errors.recipientPhone.message}
            </span>
          )}
        </label>

        <label className="block mb-2">
          Địa chỉ nhận:
          <input
            {...register("recipientAddress")}
            className="block w-full p-2 border rounded mt-1"
          />
          {errors.recipientAddress && (
            <span className="text-red-500">
              {errors.recipientAddress.message}
            </span>
          )}
        </label>

        <label className="block mb-2">
          Thành phố:
          <input
            {...register("recipientCity")}
            className="block w-full p-2 border rounded mt-1"
          />
          {errors.recipientCity && (
            <span className="text-red-500">{errors.recipientCity.message}</span>
          )}
        </label>

        <label className="block mb-2">
          Mã vùng:
          <input
            {...register("recipientZip")}
            className="block w-full p-2 border rounded mt-1"
          />
          {errors.recipientZip && (
            <span className="text-red-500">{errors.recipientZip.message}</span>
          )}
        </label>

        <div className="flex justify-end mt-4">
          <button type="button" className="mr-4 bg-gray-300 p-2 rounded">
            Bỏ qua
          </button>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImportTemplateForm;
