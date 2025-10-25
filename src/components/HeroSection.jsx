import React, { useRef } from "react";
import { motion } from "framer-motion";
import img from "../assets/img/self.jpg";
import Nav from "./Nav";

const HeroSection = () => {
  const handleScroll = () => {
    window.scrollBy({ top: 600, behavior: "smooth" });
  };
  const Menu = ["Home", "About Me", "Skills", "Experience", "Projects", "Contact Me"];

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
      {/* Main Glass Container */}
      <motion.div
        id="Home"
        className="min-h-screen flex justify-center items-center px-5 lg:px-10 md:px-5 sm:px-2 py-10 lg:py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <motion.div
          className="glass-card w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16 p-8 lg:p-20 lg:py-28 rounded-3xl"
          variants={containerVariants}>
          {/* Text Section */}
          <motion.div
            className="flex flex-col justify-center w-full lg:w-3/5 gap-y-6 text-white"
            variants={textVariants}>
            <motion.span
              className="glass-button w-fit inline-block px-6 py-3 text-white text-sm font-semibold rounded-full"
              variants={itemVariants}>
              👋 Hello There!
            </motion.span>

            <motion.div className="space-y-4" variants={itemVariants}>
              <motion.h1
                className="text-3xl lg:text-5xl md:text-4xl font-bold leading-tight"
                variants={itemVariants}>
                I'm{" "}
                <motion.span
                  className="font-bold bg-gradient-to-r from-[#2694d4] to-[#0481bf] bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}>
                  M. Ahmed Fayyaz
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl lg:text-3xl font-semibold text-blue-100"
                variants={itemVariants}>
                I am a{" "}
                <span className="text-white font-bold">Frontend Developer</span>
              </motion.p>
            </motion.div>

            <motion.p
              className="text-lg lg:text-xl text-blue-100 font-light leading-relaxed"
              variants={itemVariants}>
              Proficient in web design and development, committed to producing
              quality results that bring ideas to life through clean, modern
              code.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4"
              variants={itemVariants}>
              <motion.button
                onClick={() => {
                  const section = document.getElementById("Contact-Me");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
                className="glass-button relative inline-flex items-center justify-center overflow-hidden rounded-full group px-8 py-4 cursor-pointer text-white font-semibold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <span className="absolute inset-0 bg-gradient-to-r from-[#2694d4] to-[#0481bf] transition-all duration-300 ease-in-out scale-x-0 origin-left group-hover:scale-x-100 z-0 rounded-full"></span>
                <span className="relative z-10 flex items-center gap-3">
                  Let's Connect
                  <i className="ri-arrow-right-up-line text-xl"></i>
                </span>
              </motion.button>

              <motion.button
                onClick={() => {
                  const section = document.getElementById("About-Me");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
                className="glass-button px-8 py-4 text-white font-semibold text-lg rounded-full border border-white border-opacity-30 hover:border-opacity-60 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="w-full lg:w-2/5 flex justify-center"
            variants={imageVariants}>
            <div className="relative w-80 h-80 lg:w-96 lg:h-96 flex items-center justify-center">
              {/* Colored outline ring */}
              <div className="absolute inset-0 rounded-full ring-8 ring-[#2694d4] ring-opacity-60 pointer-events-none"></div>
              <motion.img
                className="w-80 h-80 lg:w-96 lg:h-96 rounded-full object-cover shadow-2xl relative z-10"
                src={img}
                alt="Ahmed - Frontend Developer"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="flex justify-center items-center pb-10 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}>
        <motion.button
          onClick={handleScroll}
          className="glass-button flex items-center justify-center gap-2 px-6 py-3 text-white rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-sm font-medium">Explore More</span>
          <i className="ri-scroll-to-bottom-fill text-xl text-[#2694d4]"></i>
        </motion.button>
      </motion.div>
    </>
  );
};

export default HeroSection;
