import React, { useRef } from "react";
import { motion } from "framer-motion";
import img from "../assets/img/self.jpg";
import Nav from "./Nav";

const HeroSection = () => {
  const handleScroll = () => {
    window.scrollBy({ top: 600, behavior: "smooth" });
  };
  const Menu = ["Home", "About Me", "Skills", "Projects", "Contact Me"];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <>
      <Nav title="Ahmed.Dev" menuItem={Menu} />
      <motion.div
        id="Home"
        className="flex flex-col md:flex-col lg:flex-row  lg:h-[90dvh] h-min-[100dvh] justify-center items-center mx-5 lg:mx-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {/* Text Section */}
        <motion.div
          className="flex flex-col justify-center w-full lg:w-2/3 lg:ms-32 gap-y-4 mt-10 lg:mt-0"
          variants={textVariants}>
          <motion.span
            className="relative z-10 w-fit inline-block px-4 py-2 text-black -mb-3 text-sm font-semibold  border-1 border-black static-border"
            variants={itemVariants}>
            Hello There!
          </motion.span>

          <motion.p
            className="text-4xl lg:text-4xl md:text-3xl font-bold "
            variants={itemVariants}>
            I'm{" "}
            <motion.span
              className="font-bold text-[#2694d4] rounded-tr-xl rounded-tl-lg rounded-bl-xl rounded-br-lg py-1 px-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}>
              M. Ahmed Fayyaz
            </motion.span>
          </motion.p>

          <motion.p
            className="text-xl lg:text-2xl tracking-tighter"
            variants={itemVariants}>
            I am a <span className="text-gray-500">Frontend Developer</span>
          </motion.p>

          <motion.span
            className="text-base lg:text-xl text-gray-500 font-light w-full lg:w-4/5"
            variants={itemVariants}>
            Proficient in web design and development, committed to producing
            quality results
          </motion.span>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4"
            variants={itemVariants}>
            <motion.span
              onClick={() => {
                const section = document.getElementById("Contact-Me");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative inline-flex items-center justify-center overflow-hidden rounded-4xl group px-4 py-2 cursor-pointer text-white bg-[#2694d4]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <span className="absolute inset-0 bg-[#0481bf] transition-all duration-300 ease-in-out scale-x-0 origin-left group-hover:scale-x-100 z-0"></span>
              <span className="relative z-10 flex items-center gap-2">
                Contact Me
                <motion.i
                  className="ri-arrow-right-up-line w-4 h-4 mb-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}></motion.i>
              </span>
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="w-full lg:w-1/2 flex justify-center p-5 lg:p-10 items-start lg:me-10"
          variants={imageVariants}>
          <motion.img
            className="w-[100%]  max-w-xs lg:max-w-full rounded-xl splash"
            src={img}
            alt="Ahmed - Frontend Developer"
            whileHover={{
              scale: 1.05,
              rotate: 2,
              transition: { duration: 0.3 },
            }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="flex justify-center items-center mt-5 lg:-mt-16 mb-10 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}>
        <motion.span
          onClick={handleScroll}
          className="mt-1 text-gray-600 flex items-center justify-center gap-1"
          whileHover={{ scale: 1.1 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}>
          Scroll
          <i className="ri-scroll-to-bottom-fill text-2xl text-[#0481bf]"></i>
          down
        </motion.span>
      </motion.div>
    </>
  );
};

export default HeroSection;
