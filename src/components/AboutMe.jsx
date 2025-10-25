import React from "react";
import { motion } from "framer-motion";
import img from "../assets/img/self-bg2.png";
import CV from "../assets/PDF/CV.pdf"; // Assuming you have a CV file in the assets folder
const AboutMe = () => {
  const handlePdf = () => {
    const link = document.createElement("a");
    link.href = CV; // Make sure CV is a valid URL to the PDF
    link.download = "Resume.pdf"; // Optional: name the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -100, scale: 0.8 },
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

  const textVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
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

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      id="About-Me"
      className="flex flex-col lg:flex-row bg-[#0481bf] min-h-[105dvh] gap-10 my-10 items-center px-6 lg:px-20 py-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}>
      {/* Image Section */}
      <motion.div className="w-full lg:w-2/5" variants={imageVariants}>
        <motion.img
          className="w-full max-w-sm mx-auto"
          src={img}
          alt="ahmed"
          whileHover={{
            scale: 1.05,
            rotate: 3,
            transition: { duration: 0.3 },
          }}
        />
      </motion.div>

      {/* Text Section */}
      <motion.div
        className="flex flex-col gap-y-5 w-full lg:w-3/5"
        variants={textVariants}>
        {/* Heading with line */}
        <motion.div
          className="flex items-center gap-2 text-sm font-medium text-white"
          variants={itemVariants}>
          <motion.span
            className="inline-block w-6 h-[2px] bg-amber-400"
            initial={{ width: 0 }}
            whileInView={{ width: 24 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}></motion.span>
          <span>About Me</span>
        </motion.div>

        {/* Intro */}
        <motion.p
          className="text-3xl md:text-4xl text-white font-medium"
          variants={itemVariants}>
          Who is{" "}
          <motion.span
            className="font-bold  text-amber-400"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}>
            Muhammad Ahmed Fayyaz
          </motion.span>{" "}
          ?
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-white w-full lg:w-4/5 text-base md:text-lg"
          variants={itemVariants}>
          I'm an experienced website developer with 1 year in the field.
          Collaborating with individuals, I bring passion and precision to every
          project I work on.
        </motion.p>

        {/* Stats */}
        <motion.div className="flex flex-wrap gap-5" variants={statsVariants}>
          <motion.div
            className="flex flex-col gap-y-1"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}>
            <motion.span
              className="font-medium text-2xl text-amber-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}>
              10 +
            </motion.span>
            <span className="text-white text-lg">Projects Completed</span>
          </motion.div>

          <motion.div
            className="flex flex-col gap-y-1"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}>
            <motion.span
              className="font-medium text-2xl text-amber-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}>
              2+
            </motion.span>
            <span className="text-white text-lg">Industries Served</span>
          </motion.div>

          <motion.div
            className="flex flex-col gap-y-1"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}>
            <motion.span
              className="font-medium text-2xl text-amber-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}>
              1+
            </motion.span>
            <span className="text-white text-lg">Years Experience</span>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="flex flex-wrap items-center gap-5"
          variants={itemVariants}>
          <motion.span
            onClick={handlePdf}
            className="relative inline-flex items-center justify-center overflow-hidden rounded-4xl group px-4 py-2 cursor-pointer text-white outline outline-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <span className="absolute inset-0 bg-white transition-all duration-300 ease-in-out scale-x-0 origin-left group-hover:scale-x-100 z-0"></span>
            <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors duration-300">
              Resume
              <motion.i
                className="ri-arrow-right-down-line w-4 h-4 mb-2"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}></motion.i>
            </span>
          </motion.span>

          <motion.span
            className="text-amber-300 font-medium text-lg"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}>
            Muhammad Ahmed Fayyaz
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AboutMe;
