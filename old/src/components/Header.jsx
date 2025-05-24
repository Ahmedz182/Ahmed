import React, { useState } from "react";
import logo from "../assets/img/logo_arabics.svg";
import { Link } from "react-router-dom";
// import "./header.css"; // Make sure your Tailwind CSS styles are imported

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-primary flex justify-between  px-4">
      <Link to="/">
        <img
          src={logo}
          alt="logo"
          className="h-20 rotate-2 p-2.5 hover:cursor-pointer"
        />
      </Link>
      <div className="text-tertiary text-3xl flex font-bold p-2">
        <button onClick={toggleSidebar}>{isSidebarOpen ? "X" : "☰"}</button>
      </div>

      {isSidebarOpen && (
        <div className="fixed top-0 text-xl   right-0 h-screen w-2/6 sm:w-2/3 md:w-2/4 bg-primary-light text-white p-5">
          <button
            className="text-tertiary absolute top-4 font-bold right-4"
            onClick={toggleSidebar}>
            X
          </button>
          <ul className="mt-8 px-5 text-tertiary">
            <Link to="/">
              <li className="mb-4 hover:font-bold hover:cursor-pointer ">
                Home
              </li>
            </Link>
            <Link to="/about">
              <li className="mb-4 hover:font-bold hover:cursor-pointer ">
                About
              </li>
            </Link>
            <Link to="/contact-us">
              <li className="mb-4 hover:font-bold hover:cursor-pointer ">
                Contact
              </li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
