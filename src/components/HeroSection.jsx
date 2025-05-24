import React, { useRef } from "react";
import img from "../assets/img/self.jpg";

const HeroSection = () => {
  const handleScroll = () => {
    window.scrollBy({ top: 600, behavior: "smooth" });
  };

  return (
    <>
      <div
        id="Home"
        className="flex flex-col md:flex-col lg:flex-row  lg:h-[90dvh] h-min-[100dvh] justify-center items-center mx-5 lg:mx-20">
        {/* Text Section */}
        <div className="flex flex-col justify-center w-full lg:w-2/3 lg:ms-32 gap-y-4 mt-10 lg:mt-0">
          <span className="relative z-10 w-fit inline-block px-4 py-2 text-black -mb-3 text-sm font-semibold  border-1 border-black static-border">
            Hello There!
          </span>

          <p className="text-4xl lg:text-4xl md:text-3xl font-bold ">
            I'm{" "}
            <span className="font-bold text-[#2694d4] rounded-tr-xl rounded-tl-lg rounded-bl-xl rounded-br-lg py-1 px-1">
              M. Ahmed Fayyaz
            </span>
          </p>

          <p className="text-xl lg:text-2xl tracking-tighter">
            I am a <span className="text-gray-500">Frontend Developer</span>
          </p>

          <span className="text-base lg:text-xl text-gray-500 font-light w-full lg:w-4/5">
            Proficient in web design and development, committed to producing
            quality results
          </span>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4">
            <span
              onClick={() => {
                const section = document.getElementById("Contact-Me");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative inline-flex items-center justify-center overflow-hidden rounded-4xl group px-4 py-2 cursor-pointer text-white bg-[#2694d4]">
              <span className="absolute inset-0 bg-[#0481bf] transition-all duration-300 ease-in-out scale-x-0 origin-left group-hover:scale-x-100 z-0"></span>
              <span className="relative z-10 flex items-center gap-2">
                Contact Me
                <i className="ri-arrow-right-up-line w-4 h-4 mb-2"></i>
              </span>
            </span>

            {/* <span className="relative inline-flex items-center justify-center overflow-hidden rounded-4xl group px-4 py-2 cursor-pointer text-[#2694d4] outline outline-[#0481bf]">
              <span className="absolute inset-0 bg-[#0481bf] transition-all duration-300 ease-in-out scale-x-0 origin-left group-hover:scale-x-100 z-0"></span>
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                Resume
                <i className="ri-arrow-right-down-line w-4 h-4 mb-2"></i>
              </span>
            </span> */}
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center p-5 lg:p-10 items-start lg:me-10">
          <img
            className="w-[100%]  max-w-xs lg:max-w-full rounded-xl splash"
            src={img}
            alt="Ahmed - Frontend Developer"
          />
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="flex justify-center items-center mt-5 lg:-mt-16 mb-10 cursor-pointer">
        <span
          onClick={handleScroll}
          className="mt-1 text-gray-600 flex items-center justify-center gap-1">
          Scroll
          <i className="ri-scroll-to-bottom-fill text-2xl text-[#0481bf]"></i>
          down
        </span>
      </div>
    </>
  );
};

export default HeroSection;
