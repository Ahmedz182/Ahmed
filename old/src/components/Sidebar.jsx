import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className=" fixed flex justify-center bg-primary items-center  bottom-0 left-0 sm:pb-5 px-8 sm:static">
      <div className="   flex-col ">
        <div className="flex flex-col gap-2 text-tertiary/35  text-xl sm:flex-row">
          <Link to="https://github.com/Ahmedz182/" target="_blank">
            <i class="ri-github-fill "></i>
          </Link>
          <Link to="https://facebook.com/ahmedx182" target="_blank">
            <i class="ri-facebook-circle-line"></i>
          </Link>
          <Link to="https://www.linkedin.com/in/ahmedz182/" target="_blank">
            <i class="ri-linkedin-box-fill"></i>
          </Link>
          <Link to="https://instagram.com/ahmedz182" target="_blank">
            <i class="ri-instagram-line"></i>
          </Link>
          <Link
            to="https://wa.me/+923357035717?text=Salam!%20Ahmed%20i%20got%20your%20number%20from%20your%20Portfolio"
            target="_blank">
            <i class="ri-whatsapp-line"></i>
          </Link>
          {/* <Link to="https://github.com/Ahmedz182/" target="_blank">
            <i class="ri-mail-line"></i>
          </Link> */}
          <div className="w-[2px] h-32 mx-auto bg-tertiary/35 sm:hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
