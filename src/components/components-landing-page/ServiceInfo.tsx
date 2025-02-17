// src/components/Services.jsx
import React from "react";

const services = [
  {
    title: "TEBPRINT FULFILLMENT",
    description:
      "Dịch vụ hỗ trợ sản xuất, quản lý lưu kho, tiếp nhận đóng gói và chuyển hàng cho các người bán",
    image: "https://thehuman.express/img/fulfillment-service.svg",
  },
  {
    title: "ANANBAY",
    description:
      "Dịch vụ chuyển phát nhanh quốc tế đáp ứng mọi nhu cầu khách hàng với các dịch vụ: Chuyển phát tiết kiệm; Chuyển phát tốc độ và Chuyển phát hàng hóa kho/cổng kênh",
    image: "https://thehuman.express/img/service-express.svg",
  },
  {
    title: "THE TIKTOK US SHIPPING",
    description: "Dịch vụ vận chuyển chuyển biệt dành cho các seller TiktokUS.",
    image: "https://thehuman.express/img/service-tiktok.svg",
  },
];

const Services = () => {
  // const [selectedService, setSelectedService] = useState(null);

  // const handleServiceClick = (index) => {
  //   setSelectedService(index);
  // };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="mb-3 text-[34px] font-normal">
        Dịch vụ của Ananbay Logistic Fulfillment
      </h2>
      <div className="w-[100px] bg-brightRed h-[6px] mb-5"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              {/* <button
                onClick={() => handleServiceClick(index)}
                className="text-blue-500"
              >
                {selectedService === index ? "Ẩn chi tiết" : "Xem chi tiết"}
              </button> */}
              {/* {selectedService === index && (
                <div className="mt-4">
                  <h4 className="font-bold">Chi tiết dịch vụ:</h4>
                  <p>Thông tin chi tiết về dịch vụ {service.title}...</p>
                </div>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
