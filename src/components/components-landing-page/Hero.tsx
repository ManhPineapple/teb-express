import { Link } from "react-router-dom";

import illustrationIntro from "../../assets/images/illustration-intro.svg";

const Hero = () => {
  return (
    <section id="hero">
      {/* Flex Container */}
      <div className="container flex flex-col-reverse items-center px-6 mx-auto mt-10 space-y-0 md:space-y-0 md:flex-row">
        {/* Left Item */}
        <div className="flex flex-col mb-32 space-y-12 md:w-1/2">
          <h1 className="max-w-md text-4xl font-bold text-center md:text-5xl md:text-left">
            Cầu nối của bạn đến Thị trường toàn cầu
          </h1>
          <p className="max-w-sm text-center text-darkGrayishBlue md:text-left">
            Dịch vụ ổn định và tiết kiệm chi phí, được nhiều khách hàng tin
            tưởng và đánh giá cao
          </p>
          <div className="flex justify-center md:justify-start">
            <a
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight"
            >
              Get Started
            </a>
          </div>
        </div>
        {/* Image */}
        <div className="md:w-1/2">
          <img src={illustrationIntro} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
