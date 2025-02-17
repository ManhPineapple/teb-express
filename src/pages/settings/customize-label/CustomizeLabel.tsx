// MainInterface.tsx
import { ImageUp } from "lucide-react";
import React from "react";

const CustomizeLabel: React.FC = () => {
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6 max-h-full">
        <div className="flex">
          <div className="w-1/2 p-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Ship from:
              </label>
              <input
                type="text"
                placeholder="Nhập ship from ..."
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Logo
              </label>
              <div className="border border-dashed border-gray-300 rounded p-4 text-center">
                <span className="inline-block bg-gray-100 p-2 rounded">
                  <ImageUp />
                </span>
                <p className="mt-2 text-gray-500">Upload Image</p>
                <input type="file" name="file" className="hidden" />
              </div>
              <p className="mt-2 text-gray-500 text-sm">
                Chấp nhận các tệp có định dạng: PNG, JPG, JPEG với kích thước
                dưới 1Mb. File có chiều cao - chiều rộng tối đa 84px - 84px
              </p>
            </div>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
              Lưu lại
            </button>
          </div>
          <div className="w-1/2 p-4">
            <img src="" alt="Preview label" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeLabel;
