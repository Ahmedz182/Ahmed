import React, { useState } from "react";
import experiences from "../../assets/json/Experiences";
import SectionTitle from "../../components/SectionTitle";

const Experience = () => {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <SectionTitle title="Experiences" />
      <div className="bg-primary flex sm:flex-col w-full  px-40 py-10 sm:px-8 sm:py-4 sm:gap-8 ">
        <span className="flex flex-col sm:flex-row  bg-primary py-2 px-3 w-2/5 sm:w-full ">
          {experiences.map((experience, index) => (
            <div className="flex">
              <div
                className="cursor-pointer"
                onClick={() => {
                  setSelected(index);
                }}>
                <h3
                  className={` ${
                    selected === index
                      ? "px-4 py-4  border-l-2  border-tertiary  cursor-pointer border-l-3 text-tertiary bg-tertiary/25 rounded-tr rounded-br font-semibold "
                      : "text-white px-4 py-4  border-l-2  border-tertiary/25 sm:mx-1 sm:px-2"
                  }
            transition duration-300 ease-in-out`}>
                  {experience.start_year} - {experience.end_year}
                </h3>
              </div>
            </div>
          ))}
        </span>
        <div className="flex flex-col w-full px-20 gap-3 py-34 sm:px-5">
          <h1 className="text-secondary text-2xl font-bold">
            {experiences[selected].title}
          </h1>
          <h1 className="text-tertiary text-xl  font-semibold">
            {experiences[selected].company}
          </h1>
          <p className="text-white px-2">{experiences[selected].desc}</p>
        </div>
      </div>
    </>
  );
};

export default Experience;
