import React from "react";

const Title = ({ title, name, link }) => {
  return (
    <>
      <div className="flex justify-between  items-center  me-5 lg:me-16">
        <div className="flex justify-start lg:ms-24 ms-5 gap-x-2 items-center lg:my-10 sm:my-5">
          {/* <span className=" text-4xl font-bold bg-[#2694d4] text-white uppercase  tracking-wider mt-10 my-5 ps-2 pe-2 pb-1 border-b-3 border-r-3 border-black rounded-sm relative">
        {title}
      </span> */}
          <span className="w-5 h-[2px] bg-[#2694d4]"></span>
          <span className="text-4xl font-mono">{title}</span>
        </div>

        {name && (
          <span className="bg-[#0481bf] text-white font-medium  rounded-full px-3 py-2 hover:bg-[#2694d4] transition duration-200 ease-linear">
            <a href={link}>
              View All <i class="ri-arrow-right-long-line"></i>
            </a>
          </span>
        )}
      </div>
    </>
  );
};

export default Title;
