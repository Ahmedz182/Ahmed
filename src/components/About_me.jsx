import React from "react";
import img from "../assets/img/self-bg2.png";
import CV from "../assets/PDF/CV.pdf"; // Assuming you have a CV file in the assets folder
const About_me = () => {
  const handlePdf = () => {
    const link = document.createElement("a");
    link.href = CV; // Make sure CV is a valid URL to the PDF
    link.download = "Resume.pdf"; // Optional: name the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div
      id="About-Me"
      className="flex flex-col lg:flex-row bg-[#0481bf] min-h-[105dvh] gap-10 my-10 items-center px-6 lg:px-20 py-10">
      {/* Image Section */}
      <div className="w-full lg:w-2/5">
        <img className="w-full max-w-sm mx-auto" src={img} alt="ahmed" />
      </div>

      {/* Text Section */}
      <div className="flex flex-col gap-y-5 w-full lg:w-3/5">
        {/* Heading with line */}
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <span className="inline-block w-6 h-[2px] bg-amber-400"></span>
          <span>About Me</span>
        </div>

        {/* Intro */}
        <p className="text-3xl md:text-4xl text-white font-medium">
          Who is{" "}
          <span className="font-bold  text-amber-400">
            Muhammad Ahmed Fayyaz
          </span>{" "}
          ?
        </p>

        {/* Description */}
        <p className="text-white w-full lg:w-4/5 text-base md:text-lg">
          I'm an experienced website developer with 1 year in the field.
          Collaborating with individuals, I bring passion and precision to every
          project I work on.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-5">
          <div className="flex flex-col gap-y-1">
            <span className="font-medium text-2xl text-amber-300">10 +</span>
            <span className="text-white text-lg">Projects Completed</span>
          </div>

          <div className="flex flex-col gap-y-1">
            <span className="font-medium text-2xl text-amber-300">2+</span>
            <span className="text-white text-lg">Industries Served</span>
          </div>

          <div className="flex flex-col gap-y-1">
            <span className="font-medium text-2xl text-amber-300">1+</span>
            <span className="text-white text-lg">Years Experience</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-wrap items-center gap-5">
          <span
            onClick={handlePdf}
            className="relative inline-flex items-center justify-center overflow-hidden rounded-4xl group px-4 py-2 cursor-pointer text-white outline outline-white">
            <span className="absolute inset-0 bg-white transition-all duration-300 ease-in-out scale-x-0 origin-left group-hover:scale-x-100 z-0"></span>
            <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors duration-300">
              Resume
              <i className="ri-arrow-right-down-line w-4 h-4 mb-2"></i>
            </span>
          </span>

          <span className="text-amber-300 font-medium text-lg">
            Muhammad Ahmed Fayyaz
          </span>
        </div>
      </div>
    </div>
  );
};

export default About_me;
