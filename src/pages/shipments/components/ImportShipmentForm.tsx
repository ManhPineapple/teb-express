import { importShipmentXlsx } from "@/services/shipments";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

// ✅ Form validation schema
const importShipmentSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Yêu cầu chọn file !"),
});

type ImportShipmentFormData = z.infer<typeof importShipmentSchema>;

const ImportShipmentForm = ({ modalClose }: { modalClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [importErrors, setImportErrors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [importSuccess, setImportSuccess] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImportShipmentFormData>({
    resolver: zodResolver(importShipmentSchema),
  });

  const onSubmit = async (data: ImportShipmentFormData) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    setLoading(true);

    try {
      const res = await importShipmentXlsx(formData);

      if (res.isNetworkError || res.isTimeout) {
        toast.success(
          "Quá trình nhập lô hàng đang diễn ra, vui lòng kiểm tra lại sau ít phút"
        );
      } else if (res.isError) {
        console.error("Import error:", res.error);
        toast.error(
          res.error?.response?.data || "Đã xảy ra lỗi khi nhập lô hàng"
        );
      } else {
        setTotal(res.total);
        setImportSuccess(res.import_sucess);
        setImportErrors(res.errors);
        setResultVisible(true);
      }
    } catch (error) {
      console.error("Error importing shipments:", error);
      toast.error("Đã xảy ra lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    setResultVisible(false);
    modalClose();
    window.location.reload();
  };

  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Nhập lô hàng</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <div className="flex justify-between">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="file"
            >
              File để nhập
            </label>
            <div>
              <span className="text-gray-700 text-sm font-bold">
                Tải xuống file
              </span>
              <a
                href="../../../../../Ananbay_FBA_template.xlsx"
                download="Ananbay_FBA_template.xlsx"
                className="text-blue-700 text-sm font-bold ml-1"
              >
                Mẫu Shipment XLSX
              </a>
            </div>
          </div>

          <div className="flex">
            <Paperclip />
            <input
              type="file"
              id="file"
              {...register("file")}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-5"
            />
            {errors.file && (
              <p className="text-red-500 text-xs italic">
                {errors.file.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={modalClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-[#00978c] hover:bg-[#007f72] text-white font-bold py-2 px-4 rounded-full"
          >
            Lưu lại
          </button>
        </div>
      </form>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg font-bold">Đang tải...</p>
          </div>
        </div>
      )}

      {resultVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Kết quả nhập lô hàng</h2>
            <table className="mb-5">
              <tbody>
                <tr>
                  <td>Kết quả:</td>
                  <td>
                    {importErrors.length === 0 ? (
                      <span className="text-green-600 font-semibold">
                        Thành công
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Thất bại
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Tổng số lô:</td>
                  <td>{total} lô</td>
                </tr>
                <tr>
                  <td>Thành công:</td>
                  <td>{importSuccess} lô</td>
                </tr>
              </tbody>
            </table>

            {importErrors?.length > 0 && (
              <div className="p-4 bg-white rounded shadow">
                <p className="text-lg font-semibold mb-2">Chi tiết lỗi:</p>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="border-b px-4 py-2">Dòng</th>
                      <th className="border-b px-4 py-2">Giá trị</th>
                      <th className="border-b px-4 py-2">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importErrors.map((e, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="border px-4 py-2">{e.line}</td>
                        <td className="border px-4 py-2">{e.value}</td>
                        <td className="border px-4 py-2">{e.messages}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={handleClose}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportShipmentForm;
