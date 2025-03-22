import { importXlsx } from "@/services/settings/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const importSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Yêu cầu chọn file !"),
});

type ImportFormData = z.infer<typeof importSchema>;

const ImportProductForm = ({ modalClose }: { modalClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [importErrors, setImportErrors] = useState([]);
  const [total, setTotal] = useState(0);
  const [importSuccess, setImportSuccess] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImportFormData>({
    resolver: zodResolver(importSchema),
  });

  const onSubmit = async (data: ImportFormData) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    setLoading(true);

    try {
      const importXlsxResponse = await importXlsx(formData);
    
      setTotal(importXlsxResponse.total);
      setImportSuccess(importXlsxResponse.import_success);
      setImportErrors(importXlsxResponse.errors);
      setResultVisible(true);
    } catch (error) {
      console.error("Error importing packages:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("err:", importErrors);

  const handleClose = async () => {
    setResultVisible(false);
    modalClose();
  };

  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Nhập Sản phẩm</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <div className="flex justify-between">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="file"
            >
              File để nhập
            </label>
            <div className="">
              <span className="text-gray-700 text-sm font-bold">
                Tải xuống file
              </span>

              <a
                href="../../../../../Import_product_template.xlsx"
                download="ImportProduct.xlsx"
                className="download-link text-blue-700 text-sm font-bold ml-1"
              >
                Mẫu nhập dữ liệu Sản phẩm XLSX
              </a>
            </div>
          </div>
          <div className="flex">
            <Paperclip className="" />
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
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            onClick={modalClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          >
            Lưu lại
          </button>
        </div>
      </form>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg font-bold">Loading...</p>
          </div>
        </div>
      )}

      {resultVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Import Results</h2>
            <table className="mb-5 table-result">
              <tbody>
                <tr>
                  <td>Kết quả:</td>
                  <td>
                    {importErrors ? (
                      <div>
                        <i className="success-import"></i>
                        <span>Thành công</span>
                      </div>
                    ) : (
                      <div>
                        <i className="fail-import"></i>
                        <span>Thất bại</span>
                      </div>
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Tổng số Sản phẩm:</td>
                  <td>{total} Sản phẩm</td>
                </tr>
                <tr>
                  <td>Sản phẩm thành công:</td>
                  <td>{importSuccess} Sản phẩm</td>
                </tr>
              </tbody>
            </table>

            {/* Error Details */}
            {importErrors === undefined && <div>File upload sai format!</div>}

            {importErrors && importErrors.length !== 0 && (
              <div className="p-4 bg-white rounded shadow">
                <p className="text-lg font-semibold mb-2">Chi tiết:</p>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="border-b px-4 py-2">Dòng</th>
                      <th className="border-b px-4 py-2">Giá trị cũ</th>
                      <th className="border-b px-4 py-2">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importErrors.map((e: any, index: number) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
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
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportProductForm;
