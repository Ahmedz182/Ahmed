import React from "react";

const Footer = () => {
  return (
    <>
      <div className="bg-primary py-6 px-40 flex flex-col gap-3 justify-center items-center sm:px-10">
        <div className="h-[1px] w-full bg-tertiary/70" />
        <h3 className=" text-white pt-3">
          Design and Craft by
          <b className="text-secondary px-1 cursor-pointer">M.Ahmed Fayyaz</b>
        </h3>
        <p className="text-white text-sm">Copyright © 2025</p>
      </div>
    </>
  );
};

export default Footer;
