import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section id="cta" className="bg-brightRed">
      {/* Flex Container */}
      <div className="container flex flex-col items-center justify-between px-6 py-24 mx-auto space-y-12 md:py-12 md:flex-row md:space-y-0">
        {/* Heading */}
        <div>
          <h2 className="text-5xl font-bold leading-tight text-center text-white md:text-4xl md:max-w-xl md:text-left">
            Trải nghiệm sự khác biệt
          </h2>
          <p className="text-white mt-5">
            Tạo đơn hàng chỉ trong vài phút bằng nền tảng web hoặc thông qua API
            tích hợp.
          </p>
        </div>
        {/* Button */}
        <div>
          <a
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 px-6 pt-2 text-brightRed bg-white rounded-full shadow-2xl baseline hover:bg-gray-900"
          >
            Bắt đầu
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
