import React from "react";

const Technology = () => {
  const skill = [
    "Next.js",
    "MongoDB",
    "Python",
    "Wordpress",
    "HTML",
    "CSS",
    "Bootstrap",
    "Git",
    "Tailwind",
    "JavaScript",
    "React.js",
    "WooCommerce",
    "Office",
    "Excel",
    "VS code",
    "Github",
  ];
  return (
    <>
      <div className="text-tertiary bg-primary px-28 py-10 text-xl sm:w-full sm:px-10">
        <h1>Here are a few technologies I've been working with recently :</h1>
        <div className="flex gap-4 py-5 px-1 flex-wrap">
          {skill.map((skills, index) => {
            return (
              <h1
                key={index}
                className="text-tertiary cursor-pointer border border-tertiary rounded hover:bg-tertiary hover:text-primary hover:font-semibold flex px-7 py-2 transition duration-600 ease-in-out">
                {skills}
              </h1>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Technology;
