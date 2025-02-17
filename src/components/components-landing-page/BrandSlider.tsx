import React from "react";
import Slider from "react-infinite-logo-slider";

const Component = () => {
  return (
    <>
      <div className="text-center text-[34px] font-normal leading-[50px] mt-10 mb-3">
        Đối tác của chúng tôi
      </div>
      <div className="w-[100px] bg-brightRed h-[6px] mx-auto mb-5"></div>
      <Slider
        width="250px"
        duration={10}
        pauseOnHover={true}
        blurBorders={false}
        blurBorderColor={"#fff"}
      >
        <Slider.Slide>
          <img
            src="https://thehuman.express/img/logo-dhl.svg"
            alt="any"
            className="w-36"
          />
        </Slider.Slide>
        <Slider.Slide>
          <img
            src="https://thehuman.express/img/logo-fedex.svg"
            alt="any2"
            className="w-36"
          />
        </Slider.Slide>
        <Slider.Slide>
          <img
            src="https://thehuman.express/img/logo-ups.svg"
            alt="any3"
            className="mx-auto"
          />
        </Slider.Slide>
        <Slider.Slide>
          <img
            src="https://thehuman.express/img/logo-usps.svg"
            alt="any3"
            className="w-36"
          />
        </Slider.Slide>
        <Slider.Slide>
          <a
            href="https://duat.tebprint.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://duat.tebprint.com/assets/LOGO.png"
              alt="any3"
              className="w-28"
            />
          </a>
        </Slider.Slide>
      </Slider>
    </>
  );
};

export default Component;
