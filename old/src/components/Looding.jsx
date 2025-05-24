import React from "react";
// import logo from "../assets/img/logo_arabics.svg";
import { Puff } from "react-loader-spinner";
const Looding = () => {
  return (
    <div className="bg-primary h-screen w-full flex items-center justify-center">
      {/* <img src={logo} alt="loader" className="loader w-32 " /> */}

      <Puff
        visible={true}
        height="80"
        width="80"
        color="#F97316"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Looding;
