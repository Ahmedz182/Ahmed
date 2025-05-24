import React from "react";
import ahmed from "../../assets/img/dev.png";
import SectionTitle from "../../components/SectionTitle";

const Intro = () => {
  return (
    <>
      <SectionTitle title="About Me " />

      <div className="bg-primary flex gap-16 px-24 py-12 sm:flex-col sm:px-8 sm:py-4">
        <div className="bg-primary  py-8 w-2/6 p-8 sm:w-full  sm:py-3 sm:p-5 img-wraper">
          <img
            src={ahmed}
            alt="Developer"
            loading="lazy"
            className="rounded  shadow-tertiary/50 devimg"
          />
        </div>
        <div className="flex flex-col gap-5 bg-primary text-white py-16 w-3/5 sm:w-full sm:py-4">
          <p>
            Salam there! I'm
            <strong className="text-tertiary"> Muhammad Ahmed Fayyaz</strong>, a
            dynamic and driven web developer on a mission to craft extraordinary
            digital solutions. With a fervent passion for web development, I
            thrive on turning innovative ideas into reality. My journey is
            fueled by a relentless dedication to learning, ensuring that I stay
            at the forefront of the ever-evolving world of technology. Join me
            in exploring the boundless possibilities of web development as we
            embark on a journey to create truly remarkable solutions together.
          </p>
          <p>
            Let's push the boundaries of creativity and functionality, as I
            strive to make a lasting impact in the digital landscape. Join me on
            this exciting adventure, where every line of code tells a story of
            innovation and excellence.
          </p>
        </div>
      </div>
    </>
  );
};

export default Intro;
