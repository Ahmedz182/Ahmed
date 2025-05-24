import React, { useState } from "react";
import SectionTitle from "../../components/SectionTitle";
import project from "../../assets/json/Projects";
import { Link } from "react-router-dom";

const Project = () => {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <SectionTitle title="Projects" />
      <div className="bg-primary flex gap-5 sm:flex-col w-full   ps-40 pe-10 py-10 sm:px-8 sm:py-4 sm:gap-2 ">
        <span className="flex flex-col sm:overflow-x-scroll  sm:flex-row  bg-primary py-2 px-3 w-2/5 sm:w-full sm:gap-3">
          {project.map((projects, index) => (
            <div className="flex">
              <div
                className=" cursor-pointer"
                onClick={() => {
                  setSelected(index);
                }}>
                <h3
                  className={` ${
                    selected === index
                      ? "px-4 py-4  border-l-2  border-tertiary  cursor-pointer border-l-3 text-tertiary bg-tertiary/25 rounded-tr rounded-br font-semibold "
                      : "text-white px-4 py-4  border-l-2 overflow-x-auto border-tertiary/25 sm:mx-1 sm:px-2"
                  }
            transition duration-300 ease-in-out`}>
                  {projects.title}
                </h3>
              </div>
            </div>
          ))}
        </span>

        <div className="flex flex-col -mt-24 sm:mt-0 w-full  sm:gap-2">
          <div className="flex object-fill w-fit   py-24 h-2/3 sm:py-5 sm:h-full sm:w-full">
            <img
              src={project[selected].img}
              alt="Project Cover Image"
              className="img"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col  justify-center  px-1 gap-5 -mt-10 sm:mt-0 sm:px-5">
            <h1 className="text-secondary text-2xl font-bold">
              {project[selected].title}
            </h1>
            <h1 className="text-white">
              Built in :{" "}
              <strong className="text-tertiary text-xl  font-semibold">
                {project[selected].technolgy}
              </strong>
            </h1>
            <p className="text-white text-sm  ">{project[selected].desc}</p>
            <Link to={project[selected].preview} target="_blank">
              <button
                type="button"
                className="text-tertiary cursor-pointer border  w-36 border-tertiary rounded hover:bg-tertiary hover:text-primary hover:font-semibold flex px-4 py-2 transition duration-600 ease-in-out">
                Live Preview
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Project;
