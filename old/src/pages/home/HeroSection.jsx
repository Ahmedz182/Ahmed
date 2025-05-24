import React from "react";
import devimg from "../../assets/img/developer.webp";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
import Cv from "../../assets/cv/ahmed.pdf";

const HeroSection = () => {
  const name = "Muhammad Ahmed Fayyaz.";

  return (
    <>
      <div className="bg-primary gap-3 sm:items-center overflow-hidden sm:w-full flex sm:flex-col px-32 md:px-16 sm:px-10">
        <div className="flex bg-primary flex-col gap-9 sm:gap-6 md:gap-6 py-12  w-1/8  sm:w-100">
          <h1 className="text-white bg-primary">Hi, I am</h1>
          <h1 className="typing  text-secondary bg-primary text-5xl md:text-4xl sm:text-2xl font-bold">
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString(`${name}`).start();
              }}
            />
          </h1>
          <h1 className="text-white text-5xl bg-primary md:text-4xl sm:text-2xl  font-bold ">
            I build things for the web.
          </h1>
          <p className="text-white w-[50vw] sm:w-[75vw]  bg-primary p-2">
            Innovative and results-driven Frontend Developer with expertise in
            React.js, Next.js and Tailwind CSS. Gained frontend web development
            expertise through practical experience by working on projects such
            as Virtual Question Bank and Pet Finder Web. I dedicate myself to
            transforming digital concepts into user-friendly interface solutions
            as I improve my technical ability to master the dynamic web
            development sector.
          </p>
          <div className="flex flex-row  gap-4">
            <Link to="https://www.fiverr.com/ahmedz182" target="_blank">
              <button className="text-tertiary  border   border-tertiary w-40 py-3 rounded hover:bg-tertiary  hover:text-primary hover:font-semibold transition duration-600 ease-in-out">
                Hire Me
              </button>
            </Link>
            <a href={Cv} download="Resume">
              <button className="text-tertiary  border  border-tertiary w-40 py-3 rounded hover:bg-tertiary  hover:text-primary hover:font-semibold transition duration-600 ease-in-out">
                Resume
              </button>
            </a>
          </div>
        </div>
        <div className="bg-primary py-12 sm:py-0 img-wraper">
          <img src={devimg} alt="Dev" className="img" loading="lazy" />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
