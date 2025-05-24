import React from "react";

const SectionTitle = (props) => {
  return (
    <div className="bg-primary flex py-8 ">
      <h1 className="text-secondary text-2xl ps-28 sm:ps-10 font-semibold">
        {props.title}
      </h1>
      <span className=" border-tertiary border-b-2 w-52 h-5 mx-6"></span>
    </div>
  );
};

export default SectionTitle;
