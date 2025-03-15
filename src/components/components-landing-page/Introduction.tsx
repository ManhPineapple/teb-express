import React from "react";

const Introduction = () => {
  return (
    <div className="container sm:flex bg-white shadow-lg px-4 mx-auto p-6 gap-[60px] my-[110px] rounded-lg">
      <div className="flex-4 mr-6">
        <img
          src="https://thehuman.express/img/solution.svg"
          alt="Description"
          className="w-full rounded-lg"
        />
      </div>
      <div className="flex-6">
        <h2 className="text-lg font-semibold">Giới thiệu</h2>
        <h1 className="text-2xl font-bold">
          ANANBAY - Giải pháp toàn diện cho ngành POD
        </h1>
        <p className="mt-2 text-gray-700">
          Ra đời từ năm 2019 với sứ mệnh mang đến những phương thức và sản phẩm tối ưu cho người mua trong ngành POD và Dropshipping, Ananbay tự hào với: Chất lượng tốt nhất - Chi phí gốc thấp nhất - Hệ thống tối ưu nhất.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className=" p-3 rounded">
            <div className="font-semibold text-[28px] text-brightRed">1+</div>
            <div>Năm tư vấn và triển khai</div>
          </div>
          <div className=" p-3 rounded">
            <div className="font-semibold text-[28px] text-brightRed">150+</div>
            <div>Nhân sự và chuyên gia</div>
          </div>
          <div className=" p-3 rounded">
            <div className="font-semibold text-[28px] text-brightRed">
              1000+
            </div>
            <div>Chiến dịch quảng cáo Google</div>
          </div>
          <div className=" p-3 rounded">
            <div className="font-semibold text-[28px] text-brightRed">
              5027+
            </div>
            <div>Khách hàng lớn, vừa và nhỏ</div>
          </div>
          <div className=" p-3 rounded">
            <div className="font-semibold text-[28px] text-brightRed">100+</div>
            <div>Dự án SEO thành công</div>
          </div>
          <div className=" p-3 rounded">
            <div className="font-semibold text-[28px] text-brightRed">100+</div>
            <div>Chiến lược quảng cáo</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
