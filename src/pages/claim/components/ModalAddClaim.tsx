import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { REASON_CATEGORIES } from "@/constants/claim";
import { createClaim } from "@/services/claim";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Plus } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1, { message: "Tracking name is required" }),
  reason: z.any(),
  title: z.string().min(1, { message: "Title is required" }),
});

type FormData = z.infer<typeof schema>;

const ModalAddClaim: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    data.reason = Number(data.reason);

    try {
      const response = await createClaim(data);
      if (response.status === 200) toast.success("Tạo khiếu nại thành công");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="btn btn-primary flex items-center bg-[#00978c] text-white p-2 rounded-xl px-4"
        >
          <Plus /> Add claim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded"
        >
          <h2 className="text-xl font-bold mb-4 border-b pb-5">
            Tạo một Import Template
          </h2>

          <label className="block mb-2">
            Tracking:
            <span className="text-red-600 ml-1">*</span>
            <input
              {...register("code")}
              className="block w-full p-2 border rounded mt-1"
              placeholder="Write your tracking here..."
            />
            {errors.code && (
              <span className="text-red-500">{errors.code.message}</span>
            )}
          </label>

          <label className="block mb-2">
            Reason:
            <span className="text-red-600 ml-1">*</span>
            <select
              {...register("reason")}
              className="block w-full p-2 border rounded mt-1"
            >
              <option value="">Select a reason</option>
              {REASON_CATEGORIES.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-2">
            Title:
            <span className="text-red-600 ml-1">*</span>
            <input
              {...register("title")}
              className="block w-full p-2 border rounded mt-1"
              placeholder="Write your title here..."
            />
            {errors.title && (
              <span className="text-red-500">{errors.title.message}</span>
            )}
          </label>

          <label className="block mb-2">
            Comment:
            <textarea
              id="message"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your thoughts here..."
            ></textarea>
          </label>

          <div className="border border-dashed border-gray-300 rounded p-4 text-center">
            <span className="inline-block bg-gray-100 p-2 rounded">
              <ImageUp />
            </span>
            <p className="mt-2 text-gray-500">Upload Image</p>
            <input type="file" name="file" className="hidden" />
          </div>
          <p className="mt-2 text-gray-500 text-sm border-b pb-10">
            Định dạng file hợp lệ : XLSX, PNG, JPG, JPEG.Và có dung lượng dưới
            5Mb
          </p>
          <div className="flex justify-end mt-4">
            <button type="button" className="mr-4 bg-gray-300 p-2 rounded">
              Cancle
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add claim
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddClaim;
